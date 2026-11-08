// EP.41 math model: every number shown on screen is derived here from the three givens.
// Works in the page (window.MATH) and in Node (require) for the QC validator.
(function (root) {
  const poleTime = 8, bridgeTime = 18, bridgeLen = 200;          // givens of the official question
  const extraTime = bridgeTime - poleTime;                        // 18 − 8 = 10 s, spent covering the bridge
  const speed = bridgeLen / extraTime;                            // 200 ÷ 10 = 20 m/s
  const trainLen = speed * poleTime;                              // 20 × 8 = 160 m (pole ⇒ distance = train length)
  const bridgeDist = trainLen + bridgeLen;                        // 160 + 200 = 360 m (front-to-front while crossing)
  const checkTime = bridgeDist / speed;                           // 360 ÷ 20 = 18 s  (must equal bridgeTime)
  const options = [['ก', 120], ['ข', 144], ['ค', 160], ['ง', 200]];
  const correctIndex = options.findIndex(o => o[1] === trainLen);
  const M = { poleTime, bridgeTime, bridgeLen, extraTime, speed, trainLen, bridgeDist, checkTime, options, correctIndex,
    correctLetter: correctIndex >= 0 ? options[correctIndex][0] : null };
  if (typeof module !== 'undefined' && module.exports) module.exports = M; else root.MATH = M;
})(this);
