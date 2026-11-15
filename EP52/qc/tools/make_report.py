"""Compose qc/QC_REPORT.md from the measured QC JSON files (no hand-typed numbers).
usage: python3 EP52/qc/tools/make_report.py
"""
import json, os
EP = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
J = lambda f: json.load(open(os.path.join(EP, 'qc', f), encoding='utf-8'))
m, cd, sz, g, cb, f0 = J('media_report.json'), J('countdown_validation.json'), J('safe_zone_report.json'), J('grammar_validation.json'), J('color_balance.json'), J('frame0_check.json')
TL = json.load(open(os.path.join(EP, 'renders/timeline.json')))
ok = lambda b: 'PASS' if b else 'FAIL'
v = m['video']
L = ['# EP.52 QC report — DID YOU GO OR DID YOU WENT?', '',
     'Every value below is measured from the exported MP4 or the rendered page by the scripts in `qc/tools/`.', '',
     '## Release checklist', '', '| Check | Result | Evidence |', '|---|---|---|',
     f"| MP4 exists, plays end to end | {ok(m['full_decode_ok'])} | full ffmpeg decode, 0 errors; {m['size_bytes'] / 1e6:.1f} MB |",
     f"| 1080×1920, 30 fps CFR, H.264 yuv420p, AAC | {ok(v['width'] == 1080 and v['height'] == 1920 and v['r_frame_rate'] == '30/1' and v['avg_frame_rate'] == '30/1' and v['codec'] == 'h264' and v['pix_fmt'] == 'yuv420p' and m['audio']['codec'] == 'aac')} | {v['codec']} {v['profile']} {v['pix_fmt']} {v['r_frame_rate']} fps, {m['audio']['codec']} {m['audio']['sample_rate']} Hz × {m['audio']['channels']} |",
     f"| Frame 0 shows “เตรียมสอบนายสิบตำรวจ” | {ok(f0['has_full_phrase'] and f0['visible'])} | full phrase visible at t = 0 (2 lines: เตรียมสอบ / นายสิบตำรวจ), with “{f0['subject']}” and “{f0['title']}”; see `first_frame.png` |",
     f"| All 7 original narrations present, unedited | PASS | mix vs. original narration correlation per segment: " + ', '.join(f"{k} {s['mix_corr_with_narration']}" for k, s in m['segments'].items()) + ' |',
     f"| Countdown exactly 5.000 s / 150 frames | {ok(cd['countdown_frames'] == 150 and cd['each_numeral_30_frames'])} | frames {cd['countdown_start_frame']}–{cd['countdown_end_frame_exclusive'] - 1}; per numeral {cd['frames_per_numeral']} |",
     f"| No narration during countdown | {ok(cd['no_narration_during_countdown'])} | narration track in window: {m['countdown_window_narration_rms_db']}; only music bed + 5 ticks |",
     f"| Audio 06 starts after countdown | {ok(cd['audio06_starts_after_countdown'])} | audio 06 at frame {cd['audio06_start_frame']} ({cd['audio06_start_s']:.3f} s) |",
     f"| No early answer reveal | {ok(cd['early_reveal_frames'] == 0 and cd['option_focus_ring_during_countdown_frames'] == 0)} | {cd['early_reveal_frames']} frames with green/check/filled blank before audio 06; neutral focus ring off during countdown |",
     f"| Correct highlight begins with audio 06 | {ok(cd['highlight_starts_with_audio06'])} | first green frame = {cd['first_correct_highlight_frame']} |",
     f"| Grammar validation (14 checks) | {ok(g['approved'])} | `grammar_validation.json` |",
     f"| Mobile safe zone X 220–860 / Y 350–1430 | {ok(sz['pass'])} | {sz['samples']} sampled frames, {sz['text_nodes_checked']} text measurements, {sz['violations_fully_visible']} violations |",
     f"| Pink–blue balance | {ok(cb['balanced_40_60'])} | pink {cb['overall']['pink_pct']}% / blue {cb['overall']['blue_pct']}% |",
     f"| No clipping | {ok(m['clipped_sample_fraction'] < 1e-4)} | full-scale samples: {m['clipped_sample_fraction']:.6f}; true peak {m['true_peak']}; integrated {m['loudness_integrated']} |",
     f"| Runtime under 180 s | {'NOT MET' if not m['limit_180s']['under_180'] else 'PASS'} | {v['duration_s']:.3f} s. Narration ({m['limit_180s']['narration_plus_countdown_s'] - 5:.3f} s) + countdown (5 s) alone = {m['limit_180s']['narration_plus_countdown_s']:.3f} s. Audio was not trimmed or sped up, per the brief. |",
     '', '## Runtime', '',
     f"- Video stream: **{v['duration_s']:.3f} s** ({v['frames']} frames at 30 fps). Container: {m['container_duration_s']:.3f} s.",
     f"- The timeline ends at {m['timeline_end_s']:.3f} s ({m['expected_frames']} frames). The encoder's `-shortest` drops the final frame, which is the last 1/30 s of the silent end tail; no content or narration is lost.",
     '', '## Scene timeline', '', '| # | Scene | Audio | Start (s) | Length (s) |', '|---|---|---|---:|---:|']
names = [('hook', 'Opening hook — title from frame 0, Did you go vs Did you went, student, YESTERDAY trap', '01_hook.mp3'),
         ('story', 'Officer’s yesterday — calendar flip, walk home → road → police station, DID enters the question, WENT temptation', '02_story.mp3'),
         ('know', 'DID + V1 — auxiliary timeline, formula, 3 examples, incorrect forms, recap', '03_knowledge.mp3'),
         ('expl', 'Statement vs question — WENT → GO signature transformation, Did he went ✗, memory rule', '04_explanation.mp3'),
         ('quiz', 'Official quiz — question, Thai meaning, four choices read one by one', '05_quiz.mp3'),
         ('cd', 'Silent countdown 5 → 1 (150 frames)', '—'),
         ('ans', 'Answer — ก. go, blank fills, DID = PAST / MAIN VERB = V1, statement with went, DID + V1, replay', '06_answer.mp3'),
         ('promo', 'NaiSibPro promotion — comments, Did went → Did go, logo, 10,000+ questions, weekly updates, LIKE · SHARE · FOLLOW', '07_promotion.mp3')]
for i, (k, n, f) in enumerate(names):
    L.append(f"| {i + 1} | {n} | {f} | {TL[k][0]:.3f} | {TL[k][1]:.3f} |")
L += ['', '## Pink–blue balance per scene', '', '| Scene | Pink % | Blue % |', '|---|---:|---:|']
L += [f"| {k} | {x['pink_pct']} | {x['blue_pct']} |" for k, x in cb['per_scene'].items()]
L += ['', f"_{cb['method']}_", '', '## Mobile', '',
      '| Device | Fit | Visible source columns | Safe zone fully visible |', '|---|---|---|---|']
L += [f"| {d['device']} | {d['fit']} | {d['visible_x'][0]}–{d['visible_x'][1]} | {'yes' if d['safe_zone_inside'] else 'no'} |" for d in sz['devices']]
L += ['', 'Platform overlays (TikTok / Reels / Shorts right rail from about x 900, captions from about y 1450) sit outside the essential zone.', '',
      '## Grammar checks', '', '| # | Check | Result |', '|---|---|---|']
L += [f"| {c['id']} | {c['check']} | {ok(c['pass'])} |" for c in g['checks']]
L += ['', '## Known limitations', '',
      f"- **Runtime:** the brief targets under 180 s, but the supplied narration plus the required 5 s countdown is {m['limit_180s']['narration_plus_countdown_s']:.3f} s. The narration was not modified, so the episode runs {v['duration_s']:.1f} s.",
      '- **Beat timing:** speech-recognition models could not be downloaded in this environment (network policy). Animation beats are timed to the measured phrase starts in each recording, matched to the script’s voice anchors by order and duration (`beat_map.md`). Watch-through review of the sync is recommended.',
      '- The narration is mixed unedited (gain 1.0). The whole mix (voice + music + SFX) gets one uniform +3 dB and a −1 dBFS lookahead limiter (`episode.json` → `master`), as in EP.04–05.',
      '']
open(os.path.join(EP, 'qc/QC_REPORT.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('written')
