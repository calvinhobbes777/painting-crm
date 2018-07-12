const u = undefined;

export default fn =>
  new Promise(async d => {
    try {
      let r = (await fn) || {};

      r.result !== u || r.error !== u ? d(r) : d({ result: r });
    } catch (e) {
      e.result !== u || e.error !== u ? d(e) : d({ error: e });
    }
  });
