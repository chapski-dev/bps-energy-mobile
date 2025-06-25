import { useEffect, useState } from 'react';
import { EventEmitter } from 'eventemitter3';

import { wait } from '@src/utils';

export type ChargingSession = {
  id: string;
  stationId: string;
  battery: number;
  power: number;
  energyReceived: number;
  timeLeft: number;
  cost: number;
  status: 'pending' | 'charging' | 'finished';
};
type ServiceEvents = 'sessionsUpdated' | 'sessionStarted' | 'sessionStopped' | 'sessionError' | 'loading';

const mockSesstion = {
  battery: 36,
  cost: 29,
  energyReceived: 12,
  id: '0041',
  power: 43,
  stationId: '029',
  status: 'charging',
  timeLeft: 100000
} as const;

class ChargingService extends EventEmitter<ServiceEvents> {
  private sessions: ChargingSession[] = [];
  private pollInterval?: NodeJS.Timeout;
  loading = false;


  async startSession(stationId: string) {
    try {
      this.loading = true;
      this.emit('loading', this.loading);
      await wait(1400);
      // const res = await axios.post('/sessions', { stationId });
      await this.fetchSessions(stationId);
      this.emit('sessionStarted');
    } catch (e) {
      this.emit('sessionError', e);
    } finally {
      this.loading = false;
      this.emit('loading', this.loading);
    }
  }

  async stopSession(sessionId: string) {
    try {
      this.loading = true;
      this.emit('loading', this.loading);
      await wait(1500);

      // await axios.delete(`/sessions/${sessionId}`);
      // await this.fetchSessions();
      this.sessions = this.sessions.filter((el) => el.id !== sessionId);
      this.emit('sessionsUpdated', this.sessions);
      this.emit('sessionStopped');
    } catch (e) {
      this.emit('sessionError', e);
    } finally {
      this.loading = false;
      this.emit('loading', this.loading);
    }
  }

  async fetchSessions(stationId: string) {
    try {
      this.loading = true;
      this.emit('loading', this.loading);

      // const res = await axios.get<ChargingSession[]>('/sessions');
      // this.sessions = res.data;
      if(stationId) {
        this.sessions = [...this.sessions, {...mockSesstion, id:stationId }];
      }
      
      this.emit('sessionsUpdated', this.sessions);
      if (this.sessions.length) {
        this.managePolling();
      }
    } catch (e) {
      this.emit('sessionError', e);
    } finally {
      this.loading = false;
      this.emit('loading', this.loading);
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
}
const chargingService = new ChargingService();

export default chargingService;

export function useChargingSessions() {
  const [sessions, setSessions] = useState<ChargingSession[]>(
    chargingService.getCachedSessions()
  );
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const updateHandler = (data: ChargingSession[]) => setSessions(data);
    chargingService.on('sessionsUpdated', updateHandler);
    chargingService.on('loading', setLoading);

    return () => {
      chargingService.off('sessionsUpdated', updateHandler);
      chargingService.off('loading', setLoading);
    };
  }, []);

  return {
    fetchSessions: chargingService.fetchSessions.bind(ChargingService),
    loading,
    sessions,
    startSession: chargingService.startSession.bind(ChargingService),
    stopSession: chargingService.stopSession.bind(ChargingService),
  };
}
