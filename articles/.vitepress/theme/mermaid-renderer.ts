let renderQueue: Promise<void> = Promise.resolve()
let initialized = false

export function renderMermaid(id: string, code: string) {
  const task = renderQueue.then(async () => {
    const { default: mermaid } = await import('mermaid')

    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: {
          background: '#ffffff',
          primaryColor: '#dbeafe',
          primaryBorderColor: '#2563eb',
          primaryTextColor: '#17201e',
          lineColor: '#64748b',
          secondaryColor: '#ccfbf1',
          tertiaryColor: '#f8fafc',
          clusterBkg: '#f8fafc',
          clusterBorder: '#94a3b8',
          actorBkg: '#dbeafe',
          actorBorder: '#2563eb',
          actorTextColor: '#17201e',
          actorLineColor: '#94a3b8',
          signalColor: '#475569',
          signalTextColor: '#17201e',
          labelBoxBkgColor: '#ccfbf1',
          labelBoxBorderColor: '#0f766e',
          labelTextColor: '#134e4a',
          loopTextColor: '#134e4a',
          noteBkgColor: '#fef3c7',
          noteBorderColor: '#b45309',
          noteTextColor: '#4f3600',
          activationBkgColor: '#ede9fe',
          activationBorderColor: '#7c3aed'
        },
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        flowchart: { curve: 'basis', htmlLabels: true },
        sequence: { useMaxWidth: true, wrap: true }
      })
      initialized = true
    }

    return mermaid.render(id, code)
  })

  renderQueue = task.then(
    () => undefined,
    () => undefined
  )

  return task
}
