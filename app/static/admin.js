/**
 * THAMBAPANNI NANAKA - Admin Dashboard Application Logic
 */

let adminItems = [];
let adminSearchTerm = "";
let adminToken = localStorage.getItem("thambapanni_admin_token") || "thambapanni_super_secret_admin_token_2025";

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Admin-Token": adminToken,
  };
}

async function loadAdminData() {
  const listEl = document.getElementById("adminItemsList");
  
  try {
    const res = await fetch("/api/currencies?limit=100");
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        adminItems = data.items;
      } else {
        adminItems = getStoredItems();
      }
    } else {
      adminItems = getStoredItems();
    }
  } catch (err) {
    adminItems = getStoredItems();
  }

  updateAdminStats();
  renderAdminList();
}

function getStoredItems() {
  const saved = localStorage.getItem("thambapanni_items");
  if (saved) {
    try { return JSON.parse(saved); } catch(e){}
  }
  return [];
}

function saveStoredItems(items) {
  localStorage.setItem("thambapanni_items", JSON.stringify(items));
}

function updateAdminStats() {
  const online = adminItems.filter(i => !i.is_sold).length;
  const sold = adminItems.filter(i => i.is_sold).length;
  const totalValuation = adminItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  const onlineEl = document.getElementById("statOnlineCount");
  const soldEl = document.getElementById("statSoldCount");
  const valEl = document.getElementById("statTotalValuation");

  if (onlineEl) onlineEl.innerText = online;
  if (soldEl) soldEl.innerText = sold;
  if (valEl) valEl.innerText = `LKR ${totalValuation.toLocaleString('en-US')}`;
}


function renderAdminList() {
  const listEl = document.getElementById("adminItemsList");
  if (!listEl) return;

  const filtered = adminItems.filter(item => {
    const s = adminSearchTerm.toLowerCase().trim();
    if (!s) return true;
    return item.title.toLowerCase().includes(s) || 
      (item.itemCode || item.item_code || "").toLowerCase().includes(s) ||
      (item.country || "").toLowerCase().includes(s);
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <p>No inventory items found.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(item => {
    const isSold = Boolean(item.is_sold);
    const code = item.itemCode || item.item_code || "";
    const priceFormatted = `LKR ${Number(item.price).toLocaleString('en-US')}`;
    const imgSrc = item.imageUrl || item.image_url || "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=200&q=60";

    return `
      <div class="admin-item-card" data-id="${item.id}">
        <img class="admin-item-thumb" src="${imgSrc}" alt="${item.title}"
          onerror="this.src='https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=60'">

        <div class="admin-item-details">
          <div class="admin-item-title">${item.title}</div>
          <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:3px; font-family:var(--font-cinzel); letter-spacing:1px;">
            ${code} &nbsp;•&nbsp; ${item.year} AD
          </div>
          <div class="admin-item-price">${priceFormatted}</div>
          <span class="status-pill-tag ${isSold ? 'sold' : 'instock'}" style="margin-top:4px;">
            <i class="fa-solid ${isSold ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
            ${isSold ? 'Sold Out' : 'In Stock'}
          </span>
        </div>

        <div class="admin-actions">
          <button class="btn-mini-action" onclick="openEditModal('${item.id}')" title="Edit Item">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-mini-action delete" onclick="deleteItem('${item.id}')" title="Delete Item">
            <i class="fa-solid fa-trash"></i>
          </button>

          <div class="status-toggle-box">
            <span class="status-toggle-label">${isSold ? 'SOLD' : 'LIVE'}</span>
            <label class="toggle-switch">
              <input type="checkbox" ${!isSold ? 'checked' : ''} onchange="toggleSoldStatus('${item.id}', this.checked)">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

async function toggleSoldStatus(itemId, isListed) {
  const isSold = !isListed;
  
  // Update local array first for instant responsiveness
  const idx = adminItems.findIndex(i => String(i.id) === String(itemId));
  if (idx !== -1) {
    adminItems[idx].is_sold = isSold;
    saveStoredItems(adminItems);
    updateAdminStats();
    renderAdminList();
  }

  // Sync with API
  try {
    await fetch(`/api/admin/currencies/${itemId}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_sold: isSold }),
    });
  } catch (err) {
    console.warn("Backend sync fallback to local storage:", err);
  }
}

async function deleteItem(itemId) {
  if (!confirm("Are you sure you want to delete this currency item from the catalog?")) {
    return;
  }

  adminItems = adminItems.filter(i => String(i.id) !== String(itemId));
  saveStoredItems(adminItems);
  updateAdminStats();
  renderAdminList();

  try {
    await fetch(`/api/admin/currencies/${itemId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  } catch (e) {}
}

function openEditModal(itemId) {
  const item = adminItems.find(i => String(i.id) === String(itemId));
  if (!item) return;

  document.getElementById("editItemId").value = item.id;
  document.getElementById("formModalTitle").innerText = "Edit Currency Item";
  document.getElementById("saveBtnText").innerText = "UPDATE ITEM";

  document.getElementById("formTitle").value = item.title;
  document.getElementById("formPrice").value = item.price;
  document.getElementById("formGrade").value = item.condition_grade;
  document.getElementById("formCategory").value = item.category || "banknote";
  document.getElementById("formYear").value = item.year;
  document.getElementById("formCountry").value = item.country;
  document.getElementById("formItemCode").value = item.itemCode || item.item_code || "";
  document.getElementById("formImageUrl").value = item.imageUrl || item.image_url || "";
  document.getElementById("formDescription").value = item.description || "";

  if (item.imageUrl || item.image_url) {
    document.getElementById("formImagePreview").src = item.imageUrl || item.image_url;
    document.getElementById("imagePreviewContainer").style.display = "block";
  }

  document.getElementById("itemFormModal").classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  loadAdminData();

  const searchInput = document.getElementById("adminSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      adminSearchTerm = e.target.value;
      renderAdminList();
    });
  }

  // Modal handlers
  const openAddBtn = document.getElementById("openAddItemModalBtn");
  const formModal = document.getElementById("itemFormModal");
  const closeFormBtn = document.getElementById("closeFormModalBtn");

  if (openAddBtn && formModal) {
    openAddBtn.addEventListener("click", () => {
      document.getElementById("currencyForm").reset();
      document.getElementById("editItemId").value = "";
      document.getElementById("formModalTitle").innerText = "Add New Currency Item";
      document.getElementById("saveBtnText").innerText = "SAVE ITEM";
      document.getElementById("imagePreviewContainer").style.display = "none";
      formModal.classList.add("active");
    });
  }

  if (closeFormBtn && formModal) {
    closeFormBtn.addEventListener("click", () => formModal.classList.remove("active"));
  }

  // Image Upload handler
  const chooseFileBtn = document.getElementById("chooseFileBtn");
  const fileInput = document.getElementById("formImageFile");
  const imageUrlInput = document.getElementById("formImageUrl");
  const uploadStatus = document.getElementById("imageUploadStatus");
  const previewImg = document.getElementById("formImagePreview");
  const previewBox = document.getElementById("imagePreviewContainer");

  if (chooseFileBtn && fileInput) {
    chooseFileBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      uploadStatus.style.display = "block";
      uploadStatus.innerText = "⏳ Uploading photo to Cloudinary...";

      // Direct formData upload to FastAPI endpoint
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: { "X-Admin-Token": adminToken },
          body: formData,
        });

        if (res.ok) {
          const resData = await res.json();
          const uploadedUrl = resData.data.secure_url;
          imageUrlInput.value = uploadedUrl;
          previewImg.src = uploadedUrl;
          previewBox.style.display = "block";
          uploadStatus.innerText = "✅ Image uploaded to Cloudinary successfully!";
        } else {
          // Fallback to local DataURL preview
          const reader = new FileReader();
          reader.onload = (evt) => {
            imageUrlInput.value = evt.target.result;
            previewImg.src = evt.target.result;
            previewBox.style.display = "block";
            uploadStatus.innerText = "✅ Image selected (Local preview).";
          };
          reader.readAsDataURL(file);
        }
      } catch (err) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          imageUrlInput.value = evt.target.result;
          previewImg.src = evt.target.result;
          previewBox.style.display = "block";
          uploadStatus.innerText = "✅ Image loaded.";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Form Submit
  const form = document.getElementById("currencyForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const editId = document.getElementById("editItemId").value;
      const itemPayload = {
        title: document.getElementById("formTitle").value,
        price: parseFloat(document.getElementById("formPrice").value),
        condition_grade: document.getElementById("formGrade").value,
        category: document.getElementById("formCategory").value,
        year: parseInt(document.getElementById("formYear").value),
        country: document.getElementById("formCountry").value,
        itemCode: document.getElementById("formItemCode").value,
        imageUrl: document.getElementById("formImageUrl").value,
        description: document.getElementById("formDescription").value,
        is_sold: false,
      };

      if (editId) {
        // Edit existing
        const idx = adminItems.findIndex(i => String(i.id) === String(editId));
        if (idx !== -1) {
          adminItems[idx] = { ...adminItems[idx], ...itemPayload };
        }
        try {
          await fetch(`/api/admin/currencies/${editId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(itemPayload),
          });
        } catch(e){}
      } else {
        // Add new
        const newItem = {
          id: "item-" + Date.now(),
          ...itemPayload,
          created_at: new Date().toISOString(),
        };
        adminItems.unshift(newItem);
        try {
          await fetch("/api/admin/currencies", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(itemPayload),
          });
        } catch(e){}
      }

      saveStoredItems(adminItems);
      updateAdminStats();
      renderAdminList();
      formModal.classList.remove("active");
    });
  }

  // Admin Token Settings
  const settingsBtn = document.getElementById("adminSettingsBtn");
  const tokenModal = document.getElementById("tokenModal");
  const closeTokenBtn = document.getElementById("closeTokenModalBtn");
  const saveTokenBtn = document.getElementById("saveTokenBtn");
  const secretInput = document.getElementById("adminSecretInput");

  if (settingsBtn && tokenModal) {
    settingsBtn.addEventListener("click", () => {
      secretInput.value = adminToken;
      tokenModal.classList.add("active");
    });
  }
  if (closeTokenBtn && tokenModal) {
    closeTokenBtn.addEventListener("click", () => tokenModal.classList.remove("active"));
  }
  if (saveTokenBtn) {
    saveTokenBtn.addEventListener("click", () => {
      adminToken = secretInput.value.trim();
      localStorage.setItem("thambapanni_admin_token", adminToken);
      tokenModal.classList.remove("active");
      alert("Admin Token Saved!");
    });
  }
});
