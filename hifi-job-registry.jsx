/* global window, document */
/* hifi-job-registry.jsx — mock job lifecycle for the prototype.
   Simulates a backend job that progresses through a list of named steps with
   timing. Used by Frame's `running` lifecycle and by r4b-resolve-entity. */

(function () {
  if (window.JOB_REGISTRY) return;

  const subscribers = new Map(); // jobId -> Set<callback>
  const jobs = new Map();         // jobId -> job

  function emit(jobId) {
    const subs = subscribers.get(jobId);
    if (!subs) return;
    subs.forEach((cb) => { try { cb(jobs.get(jobId)); } catch (e) { /* ignore */ } });
  }

  function nextStep(jobId) {
    const job = jobs.get(jobId);
    if (!job || job.terminal) return;
    const idx = job.steps.findIndex((s) => s.state === 'active');
    if (idx === -1) return;
    job.steps[idx].state = 'done';
    job.steps[idx].endedAt = Date.now();
    if (idx + 1 < job.steps.length) {
      job.steps[idx + 1].state = 'active';
      job.steps[idx + 1].startedAt = Date.now();
      job.activeStep = idx + 1;
      schedule(jobId);
    } else {
      job.state = 'done';
      job.terminal = true;
      job.endedAt = Date.now();
    }
    emit(jobId);
  }

  function schedule(jobId) {
    const job = jobs.get(jobId);
    if (!job || job.terminal) return;
    const step = job.steps[job.activeStep];
    if (!step) return;
    const dur = step.simDurationMs != null ? step.simDurationMs : 4000;
    if (job.timer) window.clearTimeout(job.timer);
    job.timer = window.setTimeout(() => nextStep(jobId), dur);
  }

  function start(jobId, label, steps) {
    if (jobs.has(jobId)) return jobs.get(jobId);
    const job = {
      id: jobId,
      label,
      state: 'running',
      terminal: false,
      startedAt: Date.now(),
      endedAt: null,
      activeStep: 0,
      steps: steps.map((s, i) => ({
        name: s.name,
        simDurationMs: s.simDurationMs,
        state: i === 0 ? 'active' : 'pending',
        startedAt: i === 0 ? Date.now() : null,
        endedAt: null,
      })),
      timer: null,
    };
    jobs.set(jobId, job);
    schedule(jobId);
    emit(jobId);
    return job;
  }

  function cancel(jobId) {
    const job = jobs.get(jobId);
    if (!job || job.terminal) return;
    if (job.timer) window.clearTimeout(job.timer);
    job.state = 'cancelled';
    job.terminal = true;
    job.endedAt = Date.now();
    emit(jobId);
  }

  function fail(jobId, message) {
    const job = jobs.get(jobId);
    if (!job || job.terminal) return;
    if (job.timer) window.clearTimeout(job.timer);
    const idx = job.steps.findIndex((s) => s.state === 'active');
    if (idx >= 0) {
      job.steps[idx].state = 'error';
      job.steps[idx].endedAt = Date.now();
      for (let i = idx + 1; i < job.steps.length; i++) job.steps[i].state = 'skipped';
    }
    job.state = 'error';
    job.errorMessage = message || 'Run failed.';
    job.terminal = true;
    job.endedAt = Date.now();
    emit(jobId);
  }

  function get(jobId) { return jobs.get(jobId) || null; }

  function subscribe(jobId, cb) {
    if (!subscribers.has(jobId)) subscribers.set(jobId, new Set());
    subscribers.get(jobId).add(cb);
    const job = jobs.get(jobId);
    if (job) cb(job);
    return function unsubscribe() {
      const subs = subscribers.get(jobId);
      if (subs) subs.delete(cb);
    };
  }

  function listRunning() {
    return Array.from(jobs.values()).filter((j) => j.state === 'running');
  }

  function gatedThreads() {
    const set = new Set();
    jobs.forEach((j) => { if (j.state === 'running' && j.gatesThreadId) set.add(j.gatesThreadId); });
    return set;
  }

  function setThread(jobId, threadId) {
    const job = jobs.get(jobId);
    if (!job) return;
    job.gatesThreadId = threadId || null;
    emit(jobId);
  }

  Object.assign(window, {
    JOB_REGISTRY: { start, cancel, fail, get, subscribe, listRunning, gatedThreads, setThread },
  });
})();
