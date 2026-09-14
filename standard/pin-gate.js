(function(){
  'use strict';
  const PROTECTED_ROLES=new Set(['manager','accounting']);
  const DEMO_PIN='1234';

  function requestPin(role){
    if(!PROTECTED_ROLES.has(role)) return true;
    const label=role==='manager'?'オーナー・店長':'給与管理';
    const pin=window.prompt(`${label}のPINを入力してください`,'');
    if(pin===null) return false;
    if(String(pin)===DEMO_PIN) return true;
    window.alert('PINが違います。');
    return false;
  }

  document.addEventListener('click',function(event){
    const button=event.target.closest('#role-gate [data-role]');
    if(!button) return;
    const role=button.dataset.role;
    if(requestPin(role)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  },true);

  document.addEventListener('change',function(event){
    const select=event.target.closest('#role-switch');
    if(!select) return;
    const role=select.value;
    if(requestPin(role)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const currentRole=localStorage.getItem('yutoru_standard_app_v1');
    try{
      const state=JSON.parse(currentRole||'{}');
      if(state.role) select.value=state.role;
    }catch(_){ /* keep current UI if stored data is unavailable */ }
  },true);
})();
