(function () {
  'use strict';

  const read = (key, fallback = []) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch (_) { return fallback; }
  };
  const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const statusMap = {
    'Order Placed': ['pending', 0], 'Confirmed': ['confirmed', 0], 'Packed': ['packed', 1],
    'Shipped': ['shipped', 2], 'Out for Delivery': ['out-for-delivery', 3],
    'Delivered': ['delivered', 4], 'Cancelled': ['cancelled', 0]
  };
  const labelFromValue = value => ({pending:'Order Placed', confirmed:'Confirmed', packed:'Packed', shipped:'Shipped', 'out-for-delivery':'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled'}[value] || 'Order Placed');
  const cssStatus = status => (statusMap[status]?.[0] || String(status || 'pending').toLowerCase().replaceAll(' ', '-'));

  function orders() { return read('shopEasyOrders', []); }
  function users() { return read('shopEasyUsers', []); }
  function loginAudit() { return read('shopEasyLoginAudit', []); }
  const userKey = user => String(user?.phone || user?.email || user?.id || '').toLowerCase();
  const formatValue = value => value === undefined || value === null || value === '' ? 'Not provided' : String(value);
  const lastEventsFor = user => loginAudit().filter(event => event.userKey === userKey(user));

  function renderStats() {
    const list = orders();
    const revenue = list.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + Number(o.total || 0), 0);
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    set('adminTotalOrders', list.length.toLocaleString('en-IN'));
    set('adminTotalRevenue', money(revenue));
    set('adminTotalCustomers', users().length.toLocaleString('en-IN'));
  }

  window.renderAdminOrders = function (list = orders()) {
    const table = document.getElementById('adminOrdersTable');
    if (!table) return;
    if (!list.length) {
      table.innerHTML = '<tr><td colspan="9"><div class="empty-box"><i class="fas fa-bag-shopping"></i><h2>No customer orders yet</h2><p>Orders placed during checkout will automatically appear here.</p></div></td></tr>';
      renderStats();
      return;
    }
    table.innerHTML = list.map(order => {
      const first = order.items?.[0] || {};
      const extra = Math.max(0, (order.items?.length || 1) - 1);
      const qty = (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 1), 0);
      const customer = order.customer?.name || order.address?.name || 'Guest Customer';
      const payment = String(order.payment || 'cod').toUpperCase();
      const status = order.status || 'Order Placed';
      return `<tr>
        <td><strong>${escapeHtml(order.id)}</strong><br><small>${escapeHtml(order.date || '')}</small></td>
        <td>${escapeHtml(customer)}<br><small>${escapeHtml(order.address?.phone || order.customer?.phone || '')}</small></td>
        <td>${escapeHtml(first.name || 'Product')}${extra ? `<br><small>+${extra} more</small>` : ''}</td>
        <td>ShopEasy</td><td>${qty}</td><td><strong>${money(order.total)}</strong></td><td>${escapeHtml(payment)}</td>
        <td><span class="admin-status ${cssStatus(status)}">${escapeHtml(status)}</span></td>
        <td><select class="admin-status-select" onchange="updateAdminOrderStatus('${escapeHtml(order.id)}', this.value)">
          ${['pending','confirmed','packed','shipped','out-for-delivery','delivered','cancelled'].map(v => `<option value="${v}" ${labelFromValue(v)===status?'selected':''}>${labelFromValue(v)}</option>`).join('')}
        </select></td></tr>`;
    }).join('');
    renderStats();
  };

  window.updateAdminOrderStatus = function (orderId, value) {
    const list = orders();
    const order = list.find(item => item.id === orderId);
    if (!order) return;
    const label = labelFromValue(value);
    order.status = label;
    order.statusIndex = statusMap[label]?.[1] || 0;
    order.updatedAt = new Date().toLocaleString('en-IN');
    localStorage.setItem('shopEasyOrders', JSON.stringify(list));
    const latest = read('latestOrder', null);
    if (latest?.id === orderId) localStorage.setItem('latestOrder', JSON.stringify(order));
    window.renderAdminOrders();
    if (typeof showNotification === 'function') showNotification(`Order ${orderId}: ${label}`);
  };

  window.renderAdminUsers = function (list = users()) {
    const table = document.getElementById('adminUsersTable');
    if (!table) return;
    const allOrders = orders();
    if (!list.length) {
      table.innerHTML = '<tr><td colspan="10"><div class="empty-box"><i class="fas fa-users"></i><h2>No registered users</h2><p>Users will appear here after they log in or register.</p></div></td></tr>';
      renderStats(); return;
    }
    table.innerHTML = list.map(user => {
      const count = allOrders.filter(o => (user.id && o.customer?.id === user.id) || (user.email && o.customer?.email === user.email) || (user.phone && (o.customer?.phone === user.phone || o.address?.phone === user.phone))).length;
      const initials = String(user.name || 'User').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();
      const events = lastEventsFor(user);
      const last = events[0] || {};
      const role = user.role === 'admin' ? 'Administrator' : 'Customer';
      return `<tr>
        <td><div class="admin-customer"><span>${escapeHtml(initials)}</span><div><strong>${escapeHtml(user.name || 'Customer')}</strong><small>${escapeHtml(role)}</small></div></div></td>
        <td>${escapeHtml(user.email || '—')}</td>
        <td>${escapeHtml(user.phone || '—')}</td>
        <td>${count}</td>
        <td>${escapeHtml(user.joinedAt || 'Recently')}</td>
        <td><strong>${escapeHtml(user.lastLogin || last.loginAt || 'Not logged')}</strong><br><small>${escapeHtml(user.lastLoginMethod || last.method || '—')}</small></td>
        <td>${Number(user.loginCount || events.length || 0).toLocaleString('en-IN')}</td>
        <td>${escapeHtml(user.lastDevice || last.device || 'Unknown')}<br><small>${escapeHtml(user.lastBrowser || last.browser || '')}</small></td>
        <td><span class="admin-status active">Active</span></td>
        <td><button class="table-btn edit se-user-details-btn" data-user-key="${escapeHtml(userKey(user))}"><i class="fas fa-eye"></i> Details</button></td>
      </tr>`;
    }).join('');
    table.querySelectorAll('.se-user-details-btn').forEach(button => button.addEventListener('click', () => window.openShopEasyUserDetails(button.dataset.userKey)));
    renderStats();
  };

  window.openShopEasyUserDetails = function(key) {
    const user = users().find(item => userKey(item) === String(key).toLowerCase());
    if (!user) return;
    const events = lastEventsFor(user);
    const orderList = orders().filter(o => (user.id && o.customer?.id === user.id) || (user.email && o.customer?.email === user.email) || (user.phone && (o.customer?.phone === user.phone || o.address?.phone === user.phone)));
    const spend = orderList.filter(o => o.status !== 'Cancelled').reduce((sum,o)=>sum+Number(o.total||0),0);
    const rows = [
      ['Full name', user.name], ['Mobile number', user.phone], ['Email address', user.email],
      ['Account role', user.role === 'admin' ? 'Administrator + Vendor' : 'Customer'], ['User ID', user.id],
      ['Joined date', user.joinedAt], ['Last login', user.lastLogin], ['Last active', user.lastActive],
      ['Login method', user.lastLoginMethod], ['Total logins', user.loginCount || events.length],
      ['Last device', user.lastDevice], ['Last browser', user.lastBrowser], ['Platform', user.lastPlatform],
      ['Screen size', user.lastScreen], ['Time zone', user.lastTimezone], ['Date of birth', user.dob],
      ['Gender', user.gender], ['Address', user.address], ['City', user.city], ['State', user.state],
      ['PIN code', user.pin], ['Landmark', user.landmark], ['Orders placed', orderList.length], ['Total spend', money(spend)]
    ];
    let modal = document.getElementById('seUserDetailsModal');
    if (!modal) { modal = document.createElement('div'); modal.id='seUserDetailsModal'; modal.className='se-admin-modal'; document.body.appendChild(modal); }
    modal.innerHTML = `<div class="se-admin-modal-card">
      <div class="se-admin-modal-head"><div><small>Customer intelligence</small><h2>${escapeHtml(user.name || 'Customer')}</h2></div><button type="button" class="se-admin-modal-close" aria-label="Close">&times;</button></div>
      <div class="se-admin-summary-grid"><article><span>Total Logins</span><strong>${Number(user.loginCount || events.length || 0).toLocaleString('en-IN')}</strong></article><article><span>Orders</span><strong>${orderList.length}</strong></article><article><span>Total Spend</span><strong>${money(spend)}</strong></article><article><span>Role</span><strong>${escapeHtml(user.role === 'admin' ? 'Admin' : 'User')}</strong></article></div>
      <div class="se-admin-detail-grid">${rows.map(([label,value])=>`<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(formatValue(value))}</strong></div>`).join('')}</div>
      <div class="se-login-history"><div class="se-history-title"><h3>Recent Login History</h3><span>${events.length} record${events.length===1?'':'s'}</span></div>
      ${events.length ? `<div class="se-history-list">${events.slice(0,20).map(e=>`<article><div><strong>${escapeHtml(e.loginAt)}</strong><small>${escapeHtml(e.method || 'Login')}</small></div><div><span>${escapeHtml(e.device || 'Unknown')}</span><small>${escapeHtml(e.browser || '')} · ${escapeHtml(e.platform || '')}</small></div><div><span>${escapeHtml(e.timezone || '')}</span><small>${escapeHtml(e.screen || '')}</small></div></article>`).join('')}</div>` : '<div class="empty-box"><p>No login history recorded yet.</p></div>'}
      </div></div>`;
    modal.classList.add('open');
    modal.querySelector('.se-admin-modal-close').onclick=()=>modal.classList.remove('open');
    modal.onclick=e=>{if(e.target===modal) modal.classList.remove('open');};
  };

  function ensureLoginHistoryPanel(){
    const usersSection=document.getElementById('adminUsers');
    if(!usersSection || document.getElementById('adminLoginHistoryPanel')) return;
    const panel=document.createElement('article');
    panel.id='adminLoginHistoryPanel'; panel.className='admin-panel se-login-audit-panel';
    panel.innerHTML=`<div class="se-audit-heading"><div><span class="admin-eyebrow">Security activity</span><h2>User Login History</h2><p>Latest successful logins recorded on this browser.</p></div><button class="admin-secondary-btn" id="clearLoginHistoryBtn"><i class="fas fa-trash"></i> Clear History</button></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>User</th><th>Role</th><th>Login Date & Time</th><th>Method</th><th>Device</th><th>Browser / Platform</th><th>Time Zone</th></tr></thead><tbody id="adminLoginHistoryTable"></tbody></table></div>`;
    usersSection.appendChild(panel);
    panel.querySelector('#clearLoginHistoryBtn').addEventListener('click',()=>{if(confirm('Clear all saved login history from this browser?')){localStorage.removeItem('shopEasyLoginAudit'); renderLoginHistory(); window.renderAdminUsers();}});
  }

  function renderLoginHistory(){
    const body=document.getElementById('adminLoginHistoryTable'); if(!body) return;
    const events=loginAudit();
    body.innerHTML=events.length?events.slice(0,100).map(e=>`<tr><td><strong>${escapeHtml(e.name||'User')}</strong><br><small>${escapeHtml(e.phone||e.email||'')}</small></td><td><span class="admin-status ${e.role==='admin'?'confirmed':'active'}">${escapeHtml(e.role==='admin'?'Admin':'User')}</span></td><td><strong>${escapeHtml(e.loginAt||'')}</strong></td><td>${escapeHtml(e.method||'')}</td><td>${escapeHtml(e.device||'')}<br><small>${escapeHtml(e.screen||'')}</small></td><td>${escapeHtml(e.browser||'')}<br><small>${escapeHtml(e.platform||'')}</small></td><td>${escapeHtml(e.timezone||'')}</td></tr>`).join(''):'<tr><td colspan="7"><div class="empty-box"><i class="fas fa-clock-rotate-left"></i><h2>No login records yet</h2><p>Successful logins will be listed here automatically.</p></div></td></tr>';
  }

  function addAuditStyles(){
    if(document.getElementById('seAuditStyles')) return;
    const style=document.createElement('style'); style.id='seAuditStyles'; style.textContent=`
    .se-login-audit-panel{margin-top:24px}.se-audit-heading,.se-admin-modal-head,.se-history-title{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px}.se-audit-heading h2,.se-admin-modal-head h2{margin:4px 0}.se-audit-heading p{margin:0;color:var(--muted,#64748b)}
    .se-admin-modal{position:fixed;inset:0;background:rgba(15,23,42,.68);backdrop-filter:blur(7px);z-index:99999;display:none;align-items:center;justify-content:center;padding:18px}.se-admin-modal.open{display:flex}.se-admin-modal-card{width:min(1000px,100%);max-height:92vh;overflow:auto;background:var(--card,#fff);color:var(--text,#0f172a);border-radius:24px;box-shadow:0 30px 80px rgba(0,0,0,.28)}.se-admin-modal-close{border:0;background:var(--soft,#eef2ff);font-size:28px;width:44px;height:44px;border-radius:14px;cursor:pointer}.se-admin-summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:0 22px 20px}.se-admin-summary-grid article{padding:16px;border-radius:16px;background:linear-gradient(135deg,rgba(79,70,229,.12),rgba(14,165,233,.08))}.se-admin-summary-grid span,.se-admin-detail-grid span,.se-history-list small{display:block;color:var(--muted,#64748b);font-size:12px}.se-admin-summary-grid strong{font-size:22px}.se-admin-detail-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border,#e2e8f0);margin:0 22px;border:1px solid var(--border,#e2e8f0);border-radius:16px;overflow:hidden}.se-admin-detail-grid>div{background:var(--card,#fff);padding:14px}.se-admin-detail-grid strong{word-break:break-word}.se-login-history{padding:10px 22px 24px}.se-history-title{padding:16px 0}.se-history-list{display:grid;gap:10px}.se-history-list article{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:12px;padding:14px;border:1px solid var(--border,#e2e8f0);border-radius:14px}.se-history-list span{font-size:14px}.se-user-details-btn{white-space:nowrap}
    @media(max-width:760px){.se-audit-heading{align-items:flex-start;flex-direction:column}.se-admin-summary-grid{grid-template-columns:repeat(2,1fr)}.se-admin-detail-grid{grid-template-columns:1fr}.se-history-list article{grid-template-columns:1fr}.se-admin-modal{padding:8px}.se-admin-modal-card{border-radius:18px}.se-audit-heading,.se-admin-modal-head{padding:16px}.se-admin-summary-grid,.se-login-history{padding-left:16px;padding-right:16px}.se-admin-detail-grid{margin-left:16px;margin-right:16px}}
    `; document.head.appendChild(style);
  }

  function connectFilters() {
    document.querySelectorAll('.admin-order-filter').forEach(oldButton => {
      const button = oldButton.cloneNode(true);
      oldButton.replaceWith(button);
      button.addEventListener('click', () => {
        document.querySelectorAll('.admin-order-filter').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.status;
        if (filter === 'all') return window.renderAdminOrders();
        const match = {pending:['Order Placed','Confirmed','Packed'], shipped:['Shipped','Out for Delivery'], delivered:['Delivered'], cancelled:['Cancelled']}[filter] || [];
        window.renderAdminOrders(orders().filter(o => match.includes(o.status || 'Order Placed')));
      });
    });
  }

  function init() {
    addAuditStyles();
    ensureLoginHistoryPanel();
    window.renderAdminOrders();
    window.renderAdminUsers();
    renderLoginHistory();
    connectFilters();
    renderStats();
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
  window.addEventListener('storage', init);
  setInterval(renderStats, 2500);
})();
