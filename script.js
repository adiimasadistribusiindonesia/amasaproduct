
/* =========================================================
   AMASA — PT ADIIMASA DISTRIBUSI INDONESIA
   JAVASCRIPT RESTRUKTURISASI V1
   ========================================================= */

"use strict";

/* =========================================================
   KONFIGURASI DASAR
   ========================================================= */

const AMASA_CONFIG = {
  whatsappNumber: "6280000000000",
  whatsappMessage:
    "Halo AMASA, saya ingin mendapatkan informasi mengenai produk AMASA.",
  currency: "IDR",
  companyName: "PT Adiimasa Distribusi Indonesia",
  email: ""
};


/* =========================================================
   DATA PRODUK SEMENTARA
   ---------------------------------------------------------
   Tahap admin nanti:
   Data ini akan dipindahkan ke database/API.
   Untuk review website sekarang, data lokal digunakan.
   ========================================================= */

let products = [
  {
    id: "linen-spray",
    category: "linen",
    categoryLabel: "LINEN & FABRIC CARE",
    name: "Linen Spray Anti Tungau",
    price: "Lihat Detail",
    description:
      "Produk perawatan linen dan kain dengan pilihan varian aroma.",
    image: "",
    badge: "HOME CARE",
    details:
      "Linen Spray Anti Tungau AMASA dirancang untuk kebutuhan perawatan linen dan kain. Detail varian, ukuran, aroma, harga, dan cara penggunaan nantinya dapat dikelola melalui halaman admin."
  },

  {
    id: "pelicin-pakaian",
    category: "pakaian",
    categoryLabel: "FABRIC CARE",
    name: "Pelicin Pakaian",
    price: "Lihat Detail",
    description:
      "Produk pendukung perawatan pakaian agar proses penyetrikaan lebih praktis.",
    image: "",
    badge: "FABRIC CARE",
    details:
      "Pelicin Pakaian AMASA digunakan sebagai produk pendukung perawatan pakaian. Detail ukuran, varian, aroma, harga, dan informasi penggunaan nantinya dapat dikelola melalui halaman admin."
  },

  {
    id: "parfum-mobil",
    category: "fragrance",
    categoryLabel: "FRAGRANCE",
    name: "Parfum Mobil",
    price: "Lihat Detail",
    description:
      "Pewangi kendaraan dengan berbagai pilihan karakter aroma.",
    image: "",
    badge: "VEHICLE FRAGRANCE",
    details:
      "Parfum Mobil AMASA hadir untuk kebutuhan pewangi kendaraan. Varian aroma, ukuran, harga, foto, dan detail produk nantinya dapat dikelola melalui halaman admin."
  },

  {
    id: "wiper-fluid",
    category: "vehicle",
    categoryLabel: "VEHICLE CARE",
    name: "Wiper Fluid",
    price: "Lihat Detail",
    description:
      "Cairan perawatan kaca kendaraan untuk membantu menjaga kejernihan kaca.",
    image: "",
    badge: "VEHICLE CARE",
    details:
      "Wiper Fluid AMASA merupakan produk untuk kebutuhan perawatan kaca kendaraan. Detail ukuran, harga, foto, cara penggunaan, dan informasi produk nantinya dapat dikelola melalui halaman admin."
  }
];


/* =========================================================
   HELPER
   ========================================================= */

function getElement(selector) {
  return document.querySelector(selector);
}

function getElements(selector) {
  return document.querySelectorAll(selector);
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   PENGATURAN WEBSITE DARI SUPABASE
   ========================================================= */
const AMASA_SUPABASE_URL = "https://fysaxpqpqexjnlpkbwap.supabase.co";
const AMASA_SUPABASE_KEY = "sb_publishable_DWRaEZTcNMjhglwN3nqCOw_pua8rsjD";
const amasaDb = window.supabase
  ? window.supabase.createClient(AMASA_SUPABASE_URL, AMASA_SUPABASE_KEY)
  : null;

async function loadAmasaSettings() {
  try {
    const url = AMASA_SUPABASE_URL +
      "/rest/v1/amasa_site_content?select=content" +
      "&section_slug=eq.settings&is_active=eq.true&limit=1";
    const response = await fetch(url, {
      headers: {
        apikey: AMASA_SUPABASE_KEY,
        Authorization: "Bearer " + AMASA_SUPABASE_KEY
      },
      cache: "default"
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const rows = await response.json();
    const data = rows && rows[0];
    if (!data) return;

    let settings = {};
    try { settings = JSON.parse(data.content || "{}"); } catch (e) { return; }

    if (settings.brand_name) {
      AMASA_CONFIG.brandName = settings.brand_name;
      getElements("[data-amasa-brand]").forEach((el) => el.textContent = settings.brand_name);
      document.title = settings.brand_name + " | Produk Kebutuhan Rumah Tangga";
    }
    if (settings.company_name) {
      AMASA_CONFIG.companyName = settings.company_name;
      getElements("[data-amasa-company]").forEach((el) => el.textContent = settings.company_name);
    }
    if (settings.whatsapp) {
      AMASA_CONFIG.whatsappNumber = String(settings.whatsapp).replace(/[^0-9]/g, "");
      getElements("[data-amasa-whatsapp]").forEach((el) => el.href = "https://wa.me/" + AMASA_CONFIG.whatsappNumber);
      getElements("[data-amasa-whatsapp-text]").forEach((el) => el.textContent = AMASA_CONFIG.whatsappNumber);
    }
    if (settings.email) {
      AMASA_CONFIG.email = settings.email;
      getElements("[data-amasa-email]").forEach((el) => el.href = "mailto:" + settings.email);
      getElements("[data-amasa-email-text]").forEach((el) => el.textContent = settings.email);
    }
  } catch (e) {
    console.warn("AMASA Settings REST:", e);
  }
}

async function loadAmasaAbout(){
  try{
    const url=AMASA_SUPABASE_URL+
      "/rest/v1/amasa_site_content?select=title,subtitle,content,image_url,is_active"+
      "&section_slug=eq.about&is_active=eq.true&limit=1";
    const response=await fetch(url,{
      headers:{
        apikey:AMASA_SUPABASE_KEY,
        Authorization:"Bearer "+AMASA_SUPABASE_KEY
      },
      cache: "default"
    });
    if(!response.ok)throw new Error("HTTP "+response.status);
    const rows=await response.json();
    const data=rows&&rows[0];
    if(!data)return;

    const title=getElement("[data-amasa-about-title]");
    const label=getElement("[data-amasa-about-label]");
    const p1=getElement("[data-amasa-about-p1]");
    const p2=getElement("[data-amasa-about-p2]");
    const image=getElement("[data-amasa-about-image]");

    if(label)label.textContent=data.subtitle||"";
    if(title)title.textContent=data.title||"";

    try{
      const about=JSON.parse(data.content||"{}");
      if(p1&&about.paragraph1)p1.textContent=about.paragraph1;
      if(p2&&about.paragraph2)p2.textContent=about.paragraph2;
    }catch(e){}

    if(image&&data.image_url){
      image.innerHTML="";
      const img=document.createElement("img");
      img.src=data.image_url+"?v="+Date.now();
      img.alt=data.title||"AMASA";
      image.appendChild(img);
      image.classList.add("has-image");
    }
  }catch(e){
    console.warn("AMASA About REST:",e);
  }
}
loadAmasaAbout();

async function loadAmasaHero(){
  const applyHero=(data)=>{
    if(!data)return;
    const title=getElement("[data-amasa-hero-title]");
    const subtitle=getElement("[data-amasa-hero-subtitle]");
    const body=getElement("[data-amasa-hero-content]");
    const button=getElement("[data-amasa-hero-button]");
    const image=getElement("[data-amasa-hero-image]");
    if(subtitle&&data.subtitle)subtitle.textContent=data.subtitle;
    if(title&&data.title){
      const parts=data.title.split(" Untuk ");
      title.innerHTML=parts.length===2
        ? escapeHTML(parts[0])+" <span>Untuk "+escapeHTML(parts[1])+"</span>"
        : escapeHTML(data.title);
    }
    if(body&&data.content)body.textContent=data.content;
    if(button){
      if(data.button_text)button.textContent=data.button_text;
      if(data.button_url)button.href=data.button_url;
    }
    if(image&&data.image_url){
      image.innerHTML="";
      const img=document.createElement("img");
      img.src=data.image_url+"?v="+Date.now();
      img.alt=data.title||"AMASA";
      img.style.width="100%";
      img.style.height="100%";
      img.style.objectFit="cover";
      image.appendChild(img);
      image.classList.add("has-image");
    }
  };

  try{
    const url=AMASA_SUPABASE_URL+
      "/rest/v1/amasa_site_content?select=title,subtitle,content,image_url,button_text,button_url"+
      "&section_slug=eq.hero&is_active=eq.true&limit=1";
    const response=await fetch(url,{
      headers:{
        apikey:AMASA_SUPABASE_KEY,
        Authorization:"Bearer "+AMASA_SUPABASE_KEY
      },
      cache: "default"
    });
    if(!response.ok)throw new Error("HTTP "+response.status);
    const rows=await response.json();
    if(rows&&rows.length){
      applyHero(rows[0]);
      return;
    }
  }catch(e){
    console.warn("AMASA Hero REST:",e);
  }

  if(amasaDb){
    try{
      const {data,error}=await amasaDb
        .from("amasa_site_content")
        .select("title,subtitle,content,image_url,button_text,button_url")
        .eq("section_slug","hero")
        .eq("is_active",true)
        .maybeSingle();
      if(!error&&data)applyHero(data);
    }catch(e){
      console.warn("AMASA Hero Supabase:",e);
    }
  }
}
loadAmasaHero();

/* Jalankan setelah DOM tersedia. */
loadAmasaSettings();

/* =========================================================
   MOBILE MENU
   ========================================================= */


const menuButton = getElement(".menu-button");
const mainNavigation = getElement(".main-navigation");

if (menuButton && mainNavigation) {

  menuButton.addEventListener("click", () => {
    const isOpen = mainNavigation.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

    menuButton.textContent = isOpen ? "×" : "☰";
  });


  getElements(".main-navigation a").forEach((link) => {

    link.addEventListener("click", () => {

      mainNavigation.classList.remove("open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.textContent = "☰";

    });

  });


  // Tutup menu saat pengguna klik di luar dropdown/sidebar.
  document.addEventListener("click", (event) => {

    if (!mainNavigation.classList.contains("open")) return;

    if (
      !mainNavigation.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {

      mainNavigation.classList.remove("open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.textContent = "☰";

    }

  });
}


/* =========================================================
   TAHUN FOOTER
   ========================================================= */

const copyrightYear = getElement("#copyrightYear");

if (copyrightYear) {
  copyrightYear.textContent = new Date().getFullYear();
}


/* =========================================================
   WHATSAPP
   ========================================================= */

function openWhatsApp(customMessage = AMASA_CONFIG.whatsappMessage) {

  const number = AMASA_CONFIG.whatsappNumber;

  if (!number || number === "6280000000000") {

    showNotice(
      "Nomor WhatsApp belum diatur",
      "Nomor WhatsApp AMASA belum dimasukkan. Nantinya cukup ubah satu nomor di script.js."
    );

    return;
  }

  const url =
    "https://wa.me/" +
    number +
    "?text=" +
    encodeURIComponent(customMessage);

  window.open(url, "_blank", "noopener,noreferrer");
}


getElements("[data-whatsapp]").forEach((button) => {

  button.addEventListener("click", (event) => {

    event.preventDefault();

    openWhatsApp();

  });

});


/* =========================================================
   RENDER PRODUK
   ========================================================= */

const productGrid = getElement("#productGrid");

function renderProducts(category = "all") {

  if (!productGrid) return;

  const filteredProducts =
    category === "all"
      ? products
      : products.filter(
          (product) => product.category === category
        );


  if (!filteredProducts.length) {

    productGrid.innerHTML = `
      <div class="empty-product-message">
        <h3>Produk belum tersedia</h3>
        <p>
          Belum ada produk pada kategori ini.
        </p>
      </div>
    `;

    return;
  }


  productGrid.innerHTML =
    filteredProducts
      .map((product) => {

        const imageContent = product.image
          ? `<img src="${escapeHTML(product.image)}"
                  alt="${escapeHTML(product.name)}"
                  loading="lazy">`
          : `
              <div class="product-placeholder-content">
                <strong>AMASA</strong>
                <span>${escapeHTML(product.badge)}</span>
              </div>
            `;


        return `
          <article
            class="product-card"
            data-category="${escapeHTML(product.category)}"
            data-product-id="${escapeHTML(product.id)}">

            <div class="product-image">
              ${imageContent}
            </div>

            <div class="product-content">

              <span class="product-category">
                ${escapeHTML(product.categoryLabel)}
              </span>

              <h3>
                ${escapeHTML(product.name)}
              </h3>

              <p class="product-description">
                ${escapeHTML(product.description)}
              </p>

              <div class="product-bottom">

                <strong class="product-price">
                  ${escapeHTML(product.price)}
                </strong>

                <button
                  type="button"
                  class="product-detail-button"
                  data-product-id="${escapeHTML(product.id)}">
                  Detail
                </button>

              </div>

            </div>

          </article>
        `;

      })
      .join("");


  getElements("[data-product-id]").forEach((element) => {

    element.addEventListener("click", (event) => {

      const id =
        event.currentTarget.getAttribute(
          "data-product-id"
        );

      openProductModal(id);

    });

  });

}


/* =========================================================
   FILTER KATEGORI
   ========================================================= */

async function loadAmasaCategoriesFromSupabase() {
  const container = getElement("#productCategories");
  if (!container || !window.supabase) return;

  try {
    const client = window.supabase.createClient(
      AMASA_SUPABASE_URL,
      AMASA_SUPABASE_KEY
    );

    const { data, error } = await client
      .from("amasa_categories")
      .select("id,name,slug")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const categories = Array.isArray(data) ? data : [];

    container.innerHTML = [
      '<button type="button" class="category-button active" data-category="all">Semua</button>',
      ...categories.map((category) =>
        '<button type="button" class="category-button" data-category="' +
        escapeHTML(category.slug) +
        '">' +
        escapeHTML(category.name) +
        '</button>'
      )
    ].join("");

    container.querySelectorAll(".category-button").forEach((button) => {
      button.addEventListener("click", () => {
        container.querySelectorAll(".category-button").forEach((item) => {
          item.classList.remove("active");
        });
        button.classList.add("active");
        renderProducts(button.getAttribute("data-category") || "all");
      });
    });
  } catch (error) {
    console.error("AMASA categories:", error);
  }
}


async function loadAmasaProductsFromSupabase() {
  try {
    if (!window.supabase) throw new Error("Supabase client belum termuat");
    const client = window.supabase.createClient(
      "https://fysaxpqpqexjnlpkbwap.supabase.co",
      "sb_publishable_DWRaEZTcNMjhglwN3nqCOw_pua8rsjD"
    );

    const { data, error } = await client
      .from("amasa_products")
      .select("id,name,slug,sku,short_description,description,image_url,price,sort_order,is_featured,amasa_categories(name,slug)")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    if (Array.isArray(data) && data.length) {
      products = data.map((item) => {
        const category = item.amasa_categories || {};
        const categorySlug = category.slug || "";
        const categoryLabel = String(category.name || "AMASA").toUpperCase();
        const price = item.price != null
          ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price)
          : "Lihat Detail";

        return {
          id: item.slug || item.id,
          category: categorySlug || "all",
          categoryLabel,
          name: item.name,
          price,
          description: item.short_description || "",
          image: item.image_url || "",
          badge: categoryLabel,
          details: item.description || item.short_description || "Detail produk AMASA."
        };
      });
    }

    renderProducts();
  } catch (error) {
    console.error("AMASA Supabase:", error);
    renderProducts();
  }
}

loadAmasaCategoriesFromSupabase();
loadAmasaProductsFromSupabase();


/* =========================================================
   MODAL SYSTEM
   ========================================================= */

function openModal(modal) {

  if (!modal) return;

  modal.hidden = false;

  document.body.classList.add("modal-open");

}

function closeModal(modal) {

  if (!modal) return;

  // Stop any video when the video modal is closed.
  if (modal.id === "videoModal") {
    modal.querySelectorAll("video").forEach((video) => {
      try {
        video.pause();
        video.currentTime = 0;
      } catch (e) {}
    });

    modal.querySelectorAll("iframe").forEach((iframe) => {
      iframe.src = "about:blank";
    });

    const content = modal.querySelector("#videoModalContent");
    if (content) content.innerHTML = "";
  }

  modal.hidden = true;

  document.body.classList.remove("modal-open");

}


getElements("[data-close-modal]").forEach((element) => {

  element.addEventListener("click", () => {

    const modal =
      element.closest(".modal");

    closeModal(modal);

  });

});


document.addEventListener("keydown", (event) => {

  if (event.key !== "Escape") return;

  getElements(".modal").forEach((modal) => {

    if (!modal.hidden) {
      closeModal(modal);
    }

  });

});


/* =========================================================
   POPUP DETAIL PRODUK
   ========================================================= */

const productModal =
  getElement("#productModal");

const productModalContent =
  getElement("#productModalContent");


function openProductModal(productId) {

  const product =
    products.find(
      (item) => item.id === productId
    );


  if (!product || !productModal || !productModalContent) {
    return;
  }


  const imageContent = product.image
    ? `
      <img
        src="${escapeHTML(product.image)}"
        alt="${escapeHTML(product.name)}"
        style="width:100%;border-radius:12px;">
    `
    : `
      <div
        class="product-image"
        style="min-height:300px;border-radius:12px;margin-bottom:22px;">
        <div class="product-placeholder-content">
          <strong>AMASA</strong>
          <span>${escapeHTML(product.badge)}</span>
        </div>
      </div>
    `;


  productModalContent.innerHTML = `

    ${imageContent}

    <span class="product-category">
      ${escapeHTML(product.categoryLabel)}
    </span>

    <h2>
      ${escapeHTML(product.name)}
    </h2>

    <p>
      ${escapeHTML(product.details)}
    </p>

    <div
      style="
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        margin-top:25px;
      ">

      <button
        type="button"
        class="button button-primary"
        data-modal-whatsapp="${escapeHTML(product.name)}">
        Konsultasi Produk
      </button>

    </div>
  `;


  const whatsappButton =
    productModalContent.querySelector(
      "[data-modal-whatsapp]"
    );


  if (whatsappButton) {

    whatsappButton.addEventListener(
      "click",
      () => {

        openWhatsApp(
          "Halo AMASA, saya ingin bertanya tentang produk: " +
          product.name
        );

      }
    );

  }


  openModal(productModal);

}


async function loadAmasaGallery(){
  try{
    const url=AMASA_SUPABASE_URL+
      "/rest/v1/amasa_site_content?select=title,subtitle,content,is_active"+
      "&section_slug=eq.gallery&is_active=eq.true&limit=1";
    const response=await fetch(url,{
      headers:{
        apikey:AMASA_SUPABASE_KEY,
        Authorization:"Bearer "+AMASA_SUPABASE_KEY
      },
      cache: "default"
    });
    if(!response.ok)throw new Error("HTTP "+response.status);
    const rows=await response.json();
    const data=rows&&rows[0];
    if(!data)return;

    const label=getElement("[data-amasa-gallery-label]");
    const title=getElement("[data-amasa-gallery-title]");
    const grid=getElement("#galleryGrid");
    const section=grid?.closest("section");
    if(label&&data.subtitle)label.textContent=data.subtitle;
    if(title&&data.title)title.textContent=data.title;

    let gallery={};
    try{gallery=JSON.parse(data.content||"{}")}catch(e){return}
    const items=Array.isArray(gallery.items)?gallery.items:[];

    if(!items.length){
      if(grid)grid.innerHTML="";
      if(section)section.hidden=true;
      return;
    }

    if(section)section.hidden=false;
    if(grid){
      grid.innerHTML=items.map((item,n)=>
        '<button type="button" class="gallery-item" data-gallery="'+(n+1)+'" data-gallery-image="'+escapeHTML(item.image_url||"")+'"></button>'
      ).join("");
    }

    getElements("[data-gallery]").forEach((el,n)=>{
      const item=items[n];
      if(item?.image_url){
        el.style.backgroundImage="linear-gradient(180deg, transparent 40%, rgba(8,20,32,.78)), url('"+String(item.image_url).replace(/'/g,"\\'")+"')";
        el.style.backgroundSize="cover";
        el.style.backgroundPosition="center";
        el.dataset.galleryImage=item.image_url;
      }
      el.addEventListener("click",()=>{
        if(!galleryModal||!galleryModalContent)return;
        galleryModalContent.innerHTML='<div class="gallery-modal-image-wrap">'+
          (el.dataset.galleryImage?'<img src="'+escapeHTML(el.dataset.galleryImage)+'" alt="Galeri AMASA '+(n+1)+'" class="gallery-modal-image">':"AMASA GALLERY "+(n+1))+
          '</div><h3 style="margin-top:20px;">'+escapeHTML(item?.label||"Galeri AMASA")+'</h3>';
        openModal(galleryModal);
      });
    });
  }catch(e){
    console.warn("AMASA Gallery REST:",e);
  }
}

loadAmasaGallery();

/* =========================================================
   GALLERY MODAL
   ========================================================= */

const galleryModal =
  getElement("#galleryModal");

const galleryModalContent =
  getElement("#galleryModalContent");


getElements("[data-gallery]").forEach((item) => {

  item.addEventListener("click", () => {

    const galleryId =
      item.getAttribute("data-gallery");


    if (!galleryModal || !galleryModalContent) {
      return;
    }


    galleryModalContent.innerHTML = `

      <div class="gallery-modal-image-wrap">
        ${item.dataset.galleryImage ? `<img src="${escapeHTML(item.dataset.galleryImage)}" alt="Galeri AMASA ${escapeHTML(galleryId)}" class="gallery-modal-image">` : `AMASA GALLERY ${escapeHTML(galleryId)}`}
      </div>

      <h3 style="margin-top:20px;">
        Galeri AMASA
      </h3>

      <p style="color:#667383;">
        Foto asli produk dapat dimasukkan melalui sistem
        admin pada tahap berikutnya.
      </p>

    `;


    openModal(galleryModal);

  });

});


/* =========================================================
   VIDEO MODAL
   ========================================================= */

const videoModal =
  getElement("#videoModal");

const videoModalContent =
  getElement("#videoModalContent");


async function loadAmasaTestimonials(){
  try{
    const url=AMASA_SUPABASE_URL+
      "/rest/v1/amasa_site_content?select=title,subtitle,content,is_active"+
      "&section_slug=eq.testimoni&is_active=eq.true&limit=1";
    const response=await fetch(url,{
      headers:{
        apikey:AMASA_SUPABASE_KEY,
        Authorization:"Bearer "+AMASA_SUPABASE_KEY
      },
      cache:"default"
    });
    if(!response.ok)throw new Error("HTTP "+response.status);
    const rows=await response.json();
    const data=rows&&rows[0];
    const grid=getElement("#testimonialGrid");
    const section=grid?.closest("section");
    if(!grid)return;
    if(!data){
      grid.innerHTML="";
      if(section)section.hidden=true;
      return;
    }

    const label=getElement("[data-amasa-testimonial-label]");
    const title=getElement("[data-amasa-testimonial-title]");
    if(label)label.textContent=data.subtitle||"";
    if(title)title.textContent=data.title||"";

    let testimonialData={};
    try{testimonialData=JSON.parse(data.content||"{}")}catch(e){}
    const items=Array.isArray(testimonialData.items)
      ? testimonialData.items.filter(item=>item&&(item.name||item.text))
      : [];

    if(!items.length){
      grid.innerHTML="";
      if(section)section.hidden=true;
      return;
    }

    if(section)section.hidden=false;
    grid.innerHTML=items.map(item=>{
      const rating=Math.min(5,Math.max(1,Number(item.rating)||5));
      return '<article class="testimonial-card">'+
        '<div class="rating" aria-label="Rating '+rating+' dari 5">'+
        "★".repeat(rating)+"☆".repeat(5-rating)+
        '</div>'+
        '<p>'+escapeHTML(item.text||"")+'</p>'+
        '<strong>'+escapeHTML(item.name||"Pelanggan AMASA")+'</strong>'+
        '<span>'+escapeHTML(item.role||"Pengguna AMASA")+'</span>'+
        '</article>';
    }).join("");
  }catch(e){
    console.warn("AMASA Testimoni REST:",e);
  }
}
loadAmasaTestimonials();


async function loadAmasaFaq(){
  try{
    const url=AMASA_SUPABASE_URL+
      "/rest/v1/amasa_site_content?select=title,subtitle,content,is_active"+
      "&section_slug=eq.faq&is_active=eq.true&limit=1";
    const response=await fetch(url,{headers:{
      apikey:AMASA_SUPABASE_KEY,
      Authorization:"Bearer "+AMASA_SUPABASE_KEY
    },cache:"default"});
    if(!response.ok)throw new Error("HTTP "+response.status);
    const rows=await response.json();
    const data=rows&&rows[0];
    const list=getElement("#faqList");
    const section=list?.closest("section");
    if(!list)return;
    if(!data){
      if(section)section.hidden=false;
      return;
    }
    const label=getElement("[data-amasa-faq-label]");
    const title=getElement("[data-amasa-faq-title]");
    if(label)label.textContent=data.subtitle||"";
    if(title)title.textContent=data.title||"";

    let faqData={};
    try{faqData=JSON.parse(data.content||"{}")}catch(e){}
    const items=Array.isArray(faqData.items)
      ? faqData.items.filter(item=>item&&(item.question||item.answer))
      : [];
    if(!items.length){
      if(section)section.hidden=false;
      return;
    }
    if(section)section.hidden=false;
    list.innerHTML=items.map(item=>
      '<details>'+
      '<summary>'+escapeHTML(item.question||"Pertanyaan")+'</summary>'+
      '<p>'+escapeHTML(item.answer||"")+'</p>'+
      '</details>'
    ).join("");
  }catch(e){
    console.warn("AMASA FAQ REST:",e);
  }
}
loadAmasaFaq();


async function loadAmasaVideo(){
  try{
    const url=AMASA_SUPABASE_URL+
      "/rest/v1/amasa_site_content?select=title,subtitle,content,is_active"+
      "&section_slug=eq.video&is_active=eq.true&limit=1";
    const response=await fetch(url,{
      headers:{
        apikey:AMASA_SUPABASE_KEY,
        Authorization:"Bearer "+AMASA_SUPABASE_KEY
      },
      cache: "default"
    });
    if(!response.ok)throw new Error("HTTP "+response.status);
    const rows=await response.json();
    const data=rows&&rows[0];
    if(!data)return;

    const label=getElement("[data-amasa-video-label]");
    const title=getElement("[data-amasa-video-title]");
    const grid=getElement("#videoGrid");
    const section=grid?.closest("section");
    if(label)label.textContent=data.subtitle||"";
    if(title)title.textContent=data.title||"";
    if(!grid)return;

    let videoData={};
    try{videoData=JSON.parse(data.content||"{}")}catch(e){return}
    const items=Array.isArray(videoData.items)?videoData.items:[];

    if(!items.length){
      grid.innerHTML="";
      if(section)section.hidden=true;
      return;
    }

    if(section)section.hidden=false;
    grid.innerHTML=items.map((item,n)=>
      '<button type="button" class="video-card" data-video-index="'+n+'">'+
      '<span class="video-play">▶</span>'+
      '<span>'+escapeHTML(item.title||("Video AMASA "+(n+1)))+'</span>'+
      '</button>'
    ).join("");

    getElements("[data-video-index]").forEach((card)=>{
      card.addEventListener("click",()=>{
        const item=items[Number(card.dataset.videoIndex)];
        if(!item||!item.url||!videoModal||!videoModalContent)return;

        const url=String(item.url);
        const safeUrl=escapeHTML(url);
        let media="";

        const yt=url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
        if(yt){
          media='<div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000;"><iframe src="https://www.youtube.com/embed/'+yt[1]+'" title="'+escapeHTML(item.title||"Video AMASA")+'" style="width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>';
        }else if(/\.(mp4|webm|ogg)(?:\?|#|$)/i.test(url)){
          media='<div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000;"><video src="'+safeUrl+'" controls playsinline style="width:100%;height:100%;object-fit:contain;"></video></div>';
        }else{
          media='<div style="aspect-ratio:16/9;display:grid;place-items:center;border-radius:12px;background:#0b1827;color:#fff;padding:24px;text-align:center;"><a class="button button-primary" href="'+safeUrl+'" target="_blank" rel="noopener">Buka Video</a></div>';
        }

        videoModalContent.innerHTML=media+
          '<h3 style="margin-top:20px;">'+escapeHTML(item.title||"Video AMASA")+'</h3>';
        openModal(videoModal);
      });
    });
  }catch(e){
    console.warn("AMASA Video REST:",e);
  }
}
loadAmasaVideo();



/* =========================================================
   NOTICE / POPUP INFORMASI
   ========================================================= */

function showNotice(title, message) {

  const existing =
    document.getElementById("amasaNotice");

  if (existing) {
    existing.remove();
  }


  const notice =
    document.createElement("div");

  notice.id = "amasaNotice";

  notice.innerHTML = `

    <div
      class="modal"
      style="display:grid;"
      role="dialog"
      aria-modal="true">

      <div
        class="modal-overlay"
        data-notice-close>
      </div>

      <div class="modal-box">

        <button
          type="button"
          class="modal-close"
          data-notice-close
          aria-label="Tutup">
          ×
        </button>

        <span class="section-label">
          AMASA
        </span>

        <h2>
          ${escapeHTML(title)}
        </h2>

        <p style="color:#667383;">
          ${escapeHTML(message)}
        </p>

        <button
          type="button"
          class="button button-primary"
          data-notice-close>
          Mengerti
        </button>

      </div>

    </div>
  `;


  document.body.appendChild(notice);


  getElements("[data-notice-close]").forEach(
    (button) => {

      button.addEventListener("click", () => {
        notice.remove();
      });

    }
  );

}


/* =========================================================
   ANCHOR FALLBACK
   ========================================================= */

getElements('a[href="#semua-produk"]').forEach((link) => {

  link.addEventListener("click", (event) => {

    event.preventDefault();

    const productSection =
      getElement("#produk");

    if (productSection) {
      productSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

  });

});


/* =========================================================
   READY
   ========================================================= */

document.documentElement.classList.add(
  "amasa-js-ready"
);