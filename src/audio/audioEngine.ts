// chiptune3 wraps libopenmpt via AudioWorklet; worklet files are served from /public
class Player {
  private ctx: AudioContext
  private gain: GainNode
  private workletReady: Promise<void>
  private processNode: AudioWorkletNode | null = null
  private _playing = false
  private _paused = false

  constructor() {
    this.ctx = new AudioContext()
    this.gain = this.ctx.createGain()
    this.gain.connect(this.ctx.destination)
    this.workletReady = this.ctx.audioWorklet.addModule('/chiptune3.worklet.js')
  }

  async load(url: string): Promise<void> {
    await this.workletReady
    if (this.ctx.state === 'suspended') await this.ctx.resume()

    // Stop any currently playing track
    if (this.processNode) {
      this.processNode.port.postMessage({ cmd: 'stop' })
      this.processNode.disconnect()
      this.processNode = null
    }

    const resp = await fetch(url)
    const buf = await resp.arrayBuffer()

    this.processNode = new AudioWorkletNode(this.ctx, 'libopenmpt-processor', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    })
    this.processNode.connect(this.gain)
    this.processNode.port.postMessage({ cmd: 'play', val: buf }, [buf])
    this._playing = true
    this._paused = false
  }

  pause(): void {
    if (!this.processNode || this._paused) return
    this.processNode.port.postMessage({ cmd: 'pause' })
    this._paused = true
    this._playing = false
  }

  resume(): void {
    if (!this.processNode || !this._paused) return
    this.processNode.port.postMessage({ cmd: 'unpause' })
    this._paused = false
    this._playing = true
  }

  isPlaying(): boolean {
    return this._playing
  }
}

let player: Player | null = null

function getPlayer(): Player {
  if (!player) player = new Player()
  return player
}

export async function loadMod(url: string): Promise<void> {
  await getPlayer().load(url)
}

export function play(): void {
  getPlayer().resume()
}

export function pause(): void {
  getPlayer().pause()
}

export function isPlaying(): boolean {
  return player?.isPlaying() ?? false
}
