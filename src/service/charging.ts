import { useEffect, useState } from 'react';
import { EventEmitter } from 'eventemitter3';

import {
  getCurrentChargingSessions,
  postStartChargingSession,
  postStopChargingSession
} from '@src/api';
import { Session } from '@src/api/types';
import { wait } from '@src/utils';

type ServiceEvents = 'sessionsUpdated' | 'loading';

class ChargingService extends EventEmitter<ServiceEvents> {
  private sessions: Session[] = [];
  private pollInterval?: NodeJS.Timeout;
  loading = false;

  async startSession(connector_id: number) {
    try {
      this.loading = true;
      this.emit('loading', this.loading);
      await postStartChargingSession({ connector_id })
      await this.fetchSessions();
    } finally {
      this.loading = false;
      this.emit('loading', this.loading);
    }
  }

  async stopSession(session_id: number) {
    try {
      this.loading = true;
      this.emit('loading', this.loading);
      await postStopChargingSession({ session_id })
      await wait(1500);
      await this.fetchSessions();
    } finally {
      this.loading = false;
      this.emit('loading', this.loading);
    }
  }

  async fetchSessions() {
    const res = await getCurrentChargingSessions()
    this.sessions = res.sessions;
    this.emit('sessionsUpdated', this.sessions);
    if (this.sessions.length) {
      this.managePolling();
    } else if (this.sessions.length === 0 && this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = undefined;
    }
  }

  private managePolling() {
    if (this.sessions.length > 0 && !this.pollInterval) {
      this.pollInterval = setInterval(() => this.sessions.length && this.fetchSessions(), 30000);
    } else if (this.sessions.length === 0 && this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = undefined;
    }
  }

  getCachedSessions() {
    return this.sessions;
  }

  clearSessions() {
    this.sessions = [];
    this.emit('sessionsUpdated', this.sessions);
    clearInterval(this.pollInterval);
    this.pollInterval = undefined;
  }
}
const chargingService = new ChargingService();

export default chargingService;

export function useChargingSessions() {
  const [sessions, setSessions] = useState<Session[]>(
    chargingService.getCachedSessions()
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateHandler = (data: Session[]) => setSessions(data);
    chargingService.on('sessionsUpdated', updateHandler);
    chargingService.on('loading', setLoading);

    return () => {
      chargingService.off('sessionsUpdated', updateHandler);
      chargingService.off('loading', setLoading);
    };
  }, []);

  return {
    fetchSessions: chargingService.fetchSessions.bind(chargingService),
    loading,
    sessions,
    startSession: chargingService.startSession.bind(chargingService),
    stopSession: chargingService.stopSession.bind(chargingService),
  };
}
