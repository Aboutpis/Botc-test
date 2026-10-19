/* Presentation adapter. Reads rendered state; does not write game state, intercept
   clicks, replace renderers, or access Firebase. */
(() => {
 'use strict';
 const root = document.getElementById('app');
 if (!root) return;
 const has = selector => !!root.querySelector(selector);
 const view = () => {
   if (has('.homeScene')) return 'home';
   if (has('#joinCode')) return 'join';
   if (has('#jsonFile')) return 'create';
   if (has('.endCard')) return 'end';
   if (has('.scriptgroup,.scriptbox,.scriptTokenGrid')) return 'script';
   if (has('.voteScreen')) return 'vote';
   const meta = typeof currentMeta !== 'undefined' ? currentMeta : null;
   const storyteller = typeof isST !== 'undefined' && isST;
   if (!meta) return has('.loading') ? 'loading' : 'error';
   if (meta.status === 'WAITING') return storyteller ? 'lobby' : 'playerlobby';
   if (meta.phase === 'PREPARING') {
     if (storyteller) return meta.setupStage === 'DISTRIBUTING' ? 'setup_distributing' : 'setup_auto';
     if (has('.secretRole')) return has('button[onclick="toggleRoleReveal(true)"]') ? 'role_hidden' : 'role';
     if (has('.drawTurnPanel,.drawGrid')) return 'draw_choose';
     return meta.setupStage === 'DISTRIBUTING' ? 'prep_transfer' : 'prep_wait';
   }
   if (meta.phase === 'NIGHT') {
     if (storyteller) return 'stnight';
     if (has('#answer')) return window._activePrompt?.requiresExact ? 'dummy' : 'question';
     return 'wait';
   }
   if (meta.phase === 'DAY') return storyteller ? 'stday' : 'day';
   return 'error';
 };
 let queued = false;
 function paint() {
   queued = false;
   const screen = view();
   const storyteller = typeof isST !== 'undefined' && isST;
   const participant = !storyteller && !['home','join','create','end','loading','error'].includes(screen);
   if (document.body.dataset.screen !== screen) document.body.dataset.screen = screen;
   if (document.body.dataset.participant !== String(participant)) document.body.dataset.participant = String(participant);
   root.querySelectorAll('.drawGrid button').forEach(button => {
     const claimed = button.textContent.trim() === '선택됨';
     const label = claimed ? '선택됨' : button.disabled ? '차례 대기' : '봉인된 운명';
     if (button.classList.contains('is-claimed') !== claimed) button.classList.toggle('is-claimed', claimed);
     if (button.dataset.sealState !== label) button.dataset.sealState = label;
   });
   const build = root.querySelector('.voteBuild');
   const version = document.getElementById('appVersion')?.textContent.trim();
   if (build && version && build.textContent !== version) build.textContent = version;
 }
 function schedule() {
   if (!queued) { queued = true; queueMicrotask(paint); }
 }
 new MutationObserver(schedule).observe(root, {childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['disabled']});
 const splitScreen = matchMedia('(min-width: 1000px) and (orientation: landscape)');
 splitScreen.addEventListener('change', () => {
   // Reflow the existing grimoire surface without rebuilding question inputs.
   if (typeof grimMountSplit === 'function' && typeof isST !== 'undefined' && isST && !has('.voteScreen')) {
     grimMountSplit();
   }
   schedule();
 });
 paint();
})();
