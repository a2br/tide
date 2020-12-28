export default class Flow {
  private waves: Array<{
    event: string
    actions: Array<{
      time: number
      type: 'on' | 'once'
      function: (props: Record<string, unknown>) => unknown
    }>
  }> = []

  on(
    event: string,
    callback: (props: Record<string, unknown>) => unknown
  ): void {
    const found = this.waves.findIndex(w => w.event === event)
    const address = found === -1 ? this.waves.length : found

    this.waves[address] ??= { event: event, actions: [] }
    this.waves[address].actions.push({
      time: Date.now(),
      type: 'on',
      function: callback
    })
  }

  emit(event: string, props: Record<string, unknown> = {}): void {
    const focus = this.waves.find(w => w.event === event)
    if (!focus) return
    const toDo = focus.actions
    toDo.map(task => {
      task.function(props)
      if (task.type === 'once') return undefined
      return task
    })
  }
}
