import { EventBus } from '@trutoo/event-bus'

import {
  fetchSessionStatus,
  getActiveSessionsCount,
  startChargingRequest} from '@src/api'
import { EventBusEvents } from '@src/events'

type SessionData = {
  sessionId: string
  stationId: string
  connectorId: string
  power: number // kW
  batteryLevel: number // %
  receivedKwh: number
  elapsedSec: number
  status: 'loading' | 'charging' | 'completed'
}

// Events emitted by service
export enum ChargingEvents {
  sessionUpdated = 'charging.sessionUpdated',
  sessionStarted = 'charging.sessionStarted',
  sessionCompleted = 'charging.sessionCompleted',
  activeCountChanged = 'charging.activeCountChanged',
}

export class ChargingService extends EventBus {
  private sessions: Record<string, SessionData> = {}
  private pollInterval = 30_000
  private timerId: NodeJS.Timeout | null = null

  constructor() {
    super()
    this.register(ChargingEvents.sessionUpdated, { type: 'object' })
    this.register(ChargingEvents.activeCountChanged, { type: 'number' })
  }

  startPolling() {
    if (this.timerId) return
    this.timerId = setInterval(() => this.pollAll(), this.pollInterval)
  }

  stopPolling() {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  async pollAll() {
    const ids = Object.keys(this.sessions)
    if (!ids.length) return

    for (const id of ids) {
      try {
        const data = await fetchSessionStatus(id)
        this.sessions[id] = {
          ...this.sessions[id],
          batteryLevel: data.batteryLevel,
          elapsedSec: data.elapsedSec,
          power: data.power,
          receivedKwh: data.receivedKwh,
          status: data.status
        }
        this.publish(ChargingEvents.sessionUpdated, this.sessions[id])
        if (data.status === 'completed') {
          this.publish(ChargingEvents.sessionCompleted, this.sessions[id])
          delete this.sessions[id]
          this.emitActiveCount()
        }
      } catch (err) {
        console.error('Error polling session', id, err)
      }
    }
  }

  private emitActiveCount() {
    const count = Object.keys(this.sessions).length
    this.publish(ChargingEvents.activeCountChanged, count)
  }

  async startSession(
    stationId: string,
    connectorId: string,
    qrcode?: string
  ): Promise<SessionData> {
    const res = await startChargingRequest({ connectorId, qrcode, stationId })
    const session: SessionData = {
      batteryLevel: res.batteryLevel,
      connectorId,
      elapsedSec: 0,
      power: 0,
      receivedKwh: 0,
      sessionId: res.sessionId,
      stationId,
      status: 'loading'
    }
    this.sessions[session.sessionId] = session
    this.emitActiveCount()
    this.publish(ChargingEvents.sessionStarted, session)
    this.startPolling()
    return session
  }

  // async subscribe(
  //   listener: (session: SessionData) => void
  // ): Promise<() => void> {
  //   this.on(ChargingEvents.sessionUpdated, listener)
  //   // return unsubscribe fn
  //   return () => {
  //     this.off(ChargingEvents.sessionUpdated, listener)
  //   }
  // }

  async getActiveCount(): Promise<number> {
    const count = await getActiveSessionsCount()
    return count
  }
}

export default new ChargingService()
