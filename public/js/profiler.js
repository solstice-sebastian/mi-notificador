const Profiler = () => {
  const model = {
    startMs: 0,
    stopMs: 0,
    diffMs: 0,
  };
  const start = () => {
    model.startMs = new Date().getTime();
  };
  const stop = () => {
    model.stopMs = new Date().getTime();
    model.diffMs = model.stopMs - model.startMs;
  };

  const isRunning = () => model.startMs !== 0;

  const inSeconds = () => (model.diffMs / 1000).toFixed(2);
  const inMilliseconds = () => model.diffMs;
  const get = () => model;
  const log = (namespace = 'Profiler') => {
    stop();
    return console.log(`${namespace}: diff of ${inMilliseconds()}ms | ${inSeconds()}s`);
  };

  return { start, stop, get, log, inSeconds, inMilliseconds, isRunning };
};

window.Profiler = Profiler;
