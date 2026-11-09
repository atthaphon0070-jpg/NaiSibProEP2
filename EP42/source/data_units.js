// EP.42 data-unit facts. All on-screen numbers are derived here so the maths cannot drift.
// Decimal (SI) units only: 1 MB = 10^6 Byte, 1 Mb = 10^6 bit. No 1,024-based (MiB) conversion is used.
(function () {
  const BITS_PER_BYTE = 8;
  const SPEED_Mbps = 100;            // connection, megabits per second (lowercase b)
  const FILE_MB = 500;               // file, megabytes (uppercase B)
  const FILE_Mb = FILE_MB * BITS_PER_BYTE;          // 4,000 Mb
  const TIME_S = FILE_Mb / SPEED_Mbps;              // 40 s (theoretical)
  const SPEED_MBps = SPEED_Mbps / BITS_PER_BYTE;    // 12.5 MB/s
  const WRONG_S = FILE_MB / SPEED_Mbps;             // 5 (mismatched units — invalid)
  const CHOICES = [['ก', 5], ['ข', 10], ['ค', 40], ['ง', 400]];
  const CORRECT = CHOICES.findIndex(c => c[1] === TIME_S);
  const fmt = n => n.toLocaleString('en-US');
  // simulated download: elapsed simulated seconds -> percent / MB done (constant theoretical rate)
  const sim = s => ({ pct: 100 * Math.min(1, s / TIME_S), mb: Math.min(FILE_MB, s * SPEED_MBps) });
  function validate() {
    const ok = (name, v) => ({ name, pass: !!v });
    return [
      ok('speed = 100 Mbps', SPEED_Mbps === 100),
      ok('file = 500 MB', FILE_MB === 500),
      ok('1 Byte = 8 bits', BITS_PER_BYTE === 8),
      ok('500 MB = 4,000 Mb', FILE_Mb === 4000),
      ok('time = 40 s', TIME_S === 40),
      ok('12.5 MB/s', SPEED_MBps === 12.5),
      ok('alt method 500 / 12.5 = 40', FILE_MB / SPEED_MBps === TIME_S),
      ok('correct choice = ค', CHOICES[CORRECT][0] === 'ค'),
      ok('wrong shortcut gives 5 (option ก)', WRONG_S === 5 && CHOICES[0][1] === 5),
      ok('sim 10 s -> 25 %', sim(10).pct === 25), ok('sim 20 s -> 50 %', sim(20).pct === 50),
      ok('sim 30 s -> 75 %', sim(30).pct === 75), ok('sim 40 s -> 100 %', sim(40).pct === 100),
    ];
  }
  window.UNITS = { BITS_PER_BYTE, SPEED_Mbps, FILE_MB, FILE_Mb, TIME_S, SPEED_MBps, WRONG_S, CHOICES, CORRECT, fmt, sim, validate };
})();
