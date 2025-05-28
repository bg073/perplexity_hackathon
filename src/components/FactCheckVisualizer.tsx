import React, { useRef, useState, useEffect } from 'react';

// Utility to dynamically load external scripts
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
const FORCEGRAPH_URL = 'https://unpkg.com/3d-force-graph';
const SONAR_API_URL = 'http://localhost:3001/api/sonar';

export default function FactCheckVisualizer() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const tree3dRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [fgLoaded, setFgLoaded] = useState(false);
  // Multi-step navigation state
  const [analysisSteps, setAnalysisSteps] = useState<any[]>([]); // Each step: {s, v, o, sentiment, emotion, intent, text}
  const [currentStep, setCurrentStep] = useState(0);
  const [finalSummary, setFinalSummary] = useState<any>(null);
  const [relationships, setRelationships] = useState<any[]>([]);

  // Load external scripts
  useEffect(() => {
    loadScript(PYODIDE_URL).then(() => setPyodideLoaded(true));
    loadScript(FORCEGRAPH_URL).then(() => setFgLoaded(true));
  }, []);

  // Render 3D graph for current step or all
  useEffect(() => {
    if (fgLoaded && tree3dRef.current) {
      const rels = (analysisSteps.length > 0 && currentStep >= 0 && currentStep < analysisSteps.length)
        ? [relationships[currentStep]]
        : relationships;
      const uniqueNodes = new Set<string>();
      rels.forEach(([source, , target]: [string, string, string]) => {
        uniqueNodes.add(source);
        uniqueNodes.add(target);
      });
      const nodes = Array.from(uniqueNodes).map(id => ({ id }));
      const links = rels.map(([source, , target]: [string, string, string]) => ({ source, target }));
      (window as any).ForceGraph3D()(tree3dRef.current)
        .graphData({ nodes, links })
        .width(tree3dRef.current.offsetWidth)
        .height(300);
    }
  }, [fgLoaded, tree3dRef, analysisSteps, currentStep, relationships]);

  // Parse relationships from the Sonar response
  function parseSonarRelationships(sonarContent: string) {
    const relationships: [string, string, string][] = [];
    const sectionHeader = "## Relationships Between Entities";
    let headerStartIndex = sonarContent.indexOf(sectionHeader);
    if (headerStartIndex === -1) return [];
    let effectiveHeaderLength = sectionHeader.length;
    let relationshipText = sonarContent.substring(headerStartIndex + effectiveHeaderLength);
    const nextSectionRegex = /^\s*##\s+.*$/m;
    const nextSectionMatch = relationshipText.match(nextSectionRegex);
    if (nextSectionMatch) {
      relationshipText = relationshipText.substring(0, nextSectionMatch.index);
    }
    const lines = relationshipText.split(/\r?\n/);
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        let relLineContent = trimmedLine.substring(2).trim();
        const parts = relLineContent.split('**');
        if (parts.length >= 4 && parts[0] === "") {
          const subj = parts[1].trim();
          const relation = parts[2].trim();
          const obj = parts[3].trim();
          if (subj && obj && relation) {
            relationships.push([subj, relation, obj]);
          } else if (subj && obj && !relation) {
            relationships.push([subj, "is related to", obj]);
          }
        } else {
          // Fallback for lines not strictly matching **S**R**O**
          const firstBoldEnd = relLineContent.indexOf('**', 2);
          if (firstBoldEnd === -1) continue;
          const subjFallback = relLineContent.substring(2, firstBoldEnd);
          let lastBoldStartSearch = firstBoldEnd + 2;
          let lastBoldStartIndex = -1;
          let tempIndex = -1;
          while((tempIndex = relLineContent.indexOf('**', lastBoldStartSearch)) !== -1) {
            lastBoldStartIndex = tempIndex;
            lastBoldStartSearch = tempIndex + 2;
          }
          if (lastBoldStartIndex === -1 || lastBoldStartIndex <= firstBoldEnd) continue;
          const lastBoldEnd = relLineContent.indexOf('**', lastBoldStartIndex + 2);
          if (lastBoldEnd === -1) continue;
          const objFallback = relLineContent.substring(lastBoldStartIndex + 2, lastBoldEnd);
          let relationFallback = relLineContent.substring(firstBoldEnd + 2, lastBoldStartIndex).trim();
          relationFallback = relationFallback.replace(/^['":,\s]+|['":,\s]+$/g, "").trim();
          relationFallback = relationFallback.replace(/\s+/g, ' ');
          if (subjFallback && objFallback && relationFallback) {
            relationships.push([subjFallback, relationFallback, objFallback]);
          } else if (subjFallback && objFallback && !relationFallback) {
            relationships.push([subjFallback, "is related to", objFallback]);
          }
        }
      }
    }
    return relationships;
  }


  // --- Handle input submission ---
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading || !pyodideLoaded || !fgLoaded) return;
    setError(null);
    setLoading(true);
    setAnalysisSteps([]);
    setCurrentStep(0);
    setFinalSummary(null);
    setRelationships([]);
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    try {
      // Call Sonar API
      const requestBody = {
        model: "sonar",
        messages: [
          { role: "system", content: "You are a fact-checking and information extraction assistant." },
          { role: "user", content: input }
        ],
        max_tokens: 1024,
        temperature: 0.2
      };
      let response: Response;
      try {
        response = await fetch(SONAR_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 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`
          },
          body: JSON.stringify(requestBody)
        });
      } catch (networkErr) {
        setError('Network error: Could not reach the fact-checking server.');
        setLoading(false);
        return;
      }
      let data: any;
      let rawText: string = '';
      if (!response.ok) {
        try {
          rawText = await response.text();
          // Try to parse JSON if possible
          data = JSON.parse(rawText);
        } catch {
          data = rawText;
        }
        console.error('API error response:', response.status, data);
        setError('Fact-checking service failed (status ' + response.status + '). Please try again later.');
        setLoading(false);
        return;
      }
      data = await response.json();
      let reply = '';
      if (data.choices && data.choices.length > 0) {
        reply = data.choices[0].message.content;
      } else {
        reply = JSON.stringify(data);
      }
      // Parse relationships and SVOs
      const rels = parseSonarRelationships(reply);
      setRelationships(rels);
      // Extract SVO steps and badges
      let steps: any[] = [];
      let relSection = '';
      const sectionHeader = "## Relationships Between Entities";
      let headerStartIndex = reply.indexOf(sectionHeader);
      if (headerStartIndex !== -1) {
        let effectiveHeaderLength = sectionHeader.length;
        relSection = reply.substring(headerStartIndex + effectiveHeaderLength);
      }
      // Parse each SVO/relationship step for badges
      const lines = relSection.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          // Try to extract **S** R **O**
          const parts = trimmed.split('**');
          if (parts.length >= 4 && parts[0] === "") {
            const s = parts[1].trim();
            const r = parts[2].trim();
            const o = parts[3].trim();
            // Extract badges from line
            const sentimentMatch = trimmed.match(/\[Sentiment: ([^\]]+)\]/i);
            const emotionMatch = trimmed.match(/\[Emotion: ([^\]]+)\]/i);
            const intentMatch = trimmed.match(/\[Intent: ([^\]]+)\]/i);
            steps.push({
              s, r, o,
              sentiment: sentimentMatch ? sentimentMatch[1] : undefined,
              emotion: emotionMatch ? emotionMatch[1] : undefined,
              intent: intentMatch ? intentMatch[1] : undefined,
              text: trimmed
            });
          }
        }
      }
      // Fallback: if no steps, use relationships
      if (steps.length === 0 && rels.length > 0) {
        steps = rels.map(([s, r, o]) => ({ s, r, o, text: `**${s}** ${r} **${o}**` }));
      }
      setAnalysisSteps(steps);
      // Extract final estimation/summary section
      const summaryMatch = reply.match(/## Final Estimation[\s\S]*?(Root cause:|Timeline:|Bias\/Trust:|Trust score:)[\s\S]*/i);
      let summarySection = null;
      if (summaryMatch) {
        const summaryText = reply.substring(reply.indexOf('## Final Estimation'));
        // Try to extract fields
        const rootCause = summaryText.match(/Root cause:([\s\S]*?)(\n|$)/i)?.[1]?.trim();
        const timeline = summaryText.match(/Timeline:([\s\S]*?)(\n|$)/i)?.[1]?.trim();
        const biasTrust = summaryText.match(/Bias\/Trust:([\s\S]*?)(\n|$)/i)?.[1]?.trim();
        const trustScore = summaryText.match(/Trust score:([\s\S]*?)(\n|$)/i)?.[1]?.trim();
        summarySection = { rootCause, timeline, biasTrust, trustScore };
      }
      setFinalSummary(summarySection);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        relationships: rels
      } as any]);
    } catch (err: any) {
      setError('Failed to fetch analysis: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  // --- Render 3D Graph when assistant message is added ---
  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role === 'assistant' &&
      window.ForceGraph3D && tree3dRef.current
    ) {
      // Use real relationships if present
      const lastMsg: any = messages[messages.length - 1];
      let nodes: any[] = [], links: any[] = [];
      if (lastMsg.relationships && lastMsg.relationships.length > 0) {
        const uniqueNodes = new Set<string>();
        lastMsg.relationships.forEach(([source, , target]: [string, string, string]) => {
          uniqueNodes.add(source);
          uniqueNodes.add(target);
        });
        nodes = Array.from(uniqueNodes).map(id => ({ id }));
        links = lastMsg.relationships.map(([source, , target]: [string, string, string]) => ({ source, target }));
      } else {
        // fallback
        nodes = [ { id: 'A' }, { id: 'B' }, { id: 'C' } ];
        links = [ { source: 'A', target: 'B' }, { source: 'A', target: 'C' } ];
      }
      (window as any).ForceGraph3D()(tree3dRef.current)
        .graphData({ nodes, links })
        .width(tree3dRef.current.offsetWidth)
        .height(300);
    }
  }, [messages]);

  return (
    <div style={{ background: '#181f2a', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 700, margin: 'auto', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 0 1rem 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {messages.length === 0 && (
            <div style={{ color: '#bbb', textAlign: 'center', marginTop: 40 }}>
              <h2>Fact-Checking AI Assistant</h2>
              <p>Ask me to analyze a news article or describe an incident.<br />Paste a URL or description below.</p>
            </div>
          )}
          {messages.map((msg: any, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {msg.role === 'assistant' && i === messages.length - 1 && (
                <div ref={tree3dRef} style={{ height: 300, width: '100%', border: '1px solid #33415d', borderRadius: 8, background: '#5480a3', marginBottom: 18 }} />
              )}
              <div style={{ whiteSpace: 'pre-line', color: msg.role === 'user' ? '#fff' : '#c9e3ff', fontSize: 16, padding: '10px 14px', borderRadius: 8 }}>
                {msg.content}
              </div>
              {/* Final summary */}
              {finalSummary && currentStep === analysisSteps.length - 1 && msg.role === 'assistant' && i === messages.length - 1 && (
                <div style={{ marginTop: 28, background: '#26344d', borderRadius: 10, padding: 18, color: '#fff' }}>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: '#ffb300' }}>Final Estimation</div>
                  {finalSummary.rootCause && <div><b>Root cause:</b> {finalSummary.rootCause}</div>}
                  {finalSummary.timeline && <div><b>Timeline:</b> {finalSummary.timeline}</div>}
                  {finalSummary.biasTrust && <div><b>Bias/Trust:</b> {finalSummary.biasTrust}</div>}
                  {finalSummary.trustScore && <div><b>Trust score:</b> {finalSummary.trustScore}</div>}
                </div>
              )}
            </div>
          ))}
          {error && (
            <div style={{ color: '#ff6b6b', textAlign: 'center', margin: '12px 0' }}>{error}</div>
          )}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 12, background: '#232e47', padding: 16, borderRadius: 12, margin: '16px 0' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste a news article, URL, or describe an incident..."
              style={{
                flex: 1,
                fontSize: 16,
                padding: '12px 16px',
                borderRadius: 10,
                border: 'none',
                outline: 'none',
                background: '#232e42',
                color: '#fff',
                boxShadow: '0 1px 4px rgba(35,46,66,0.07)'
              }}
              disabled={loading || !pyodideLoaded || !fgLoaded}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !pyodideLoaded || !fgLoaded || !input.trim()}
              style={{
                padding: '10px 18px',
                background: 'linear-gradient(90deg,#5f72bd,#9b23ea)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                boxShadow: '0 1px 4px rgba(95,114,189,0.14)'
              }}
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
