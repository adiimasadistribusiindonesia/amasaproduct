
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
  if (!amasaDb) return;

  const { data, error } = await amasaDb
    .from("amasa_site_content")
    .select("content")
    .eq("section_slug", "settings")
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return;

  let settings = {};
  try {
    settings = JSON.parse(data.content || "{}");
  } catch (e) {
    return;
  }

  if (settings.brand_name) {
    AMASA_CONFIG.brandName = settings.brand_name;
    getElements("[data-amasa-brand]").forEach((el) => {
      el.textContent = settings.brand_name;
    });
    document.title = settings.brand_name + " | Produk Kebutuhan Rumah Tangga";
  }

  if (settings.company_name) {
    AMASA_CONFIG.companyName = settings.company_name;
    getElements("[data-amasa-company]").forEach((el) => {
      el.textContent = settings.company_name;
    });
  }

  if (settings.whatsapp) {
    AMASA_CONFIG.whatsappNumber = String(settings.whatsapp).replace(/[^0-9]/g, "");
    getElements("[data-amasa-whatsapp]").forEach((el) => {
      el.href = "https://wa.me/" + AMASA_CONFIG.whatsappNumber;
    });
    getElements("[data-amasa-whatsapp-text]").forEach((el) => {
      el.textContent = AMASA_CONFIG.whatsappNumber;
    });
  }

  if (settings.email) {
    AMASA_CONFIG.email = settings.email;
    getElements("[data-amasa-email]").forEach((el) => {
      el.href = "mailto:" + settings.email;
    });
    getElements("[data-amasa-email-text]").forEach((el) => {
      el.textContent = settings.email;
    });
  }
}

async function loadAmasaAbout(){
  if(!amasaDb)return;
  const {data,error}=await amasaDb.from("amasa_site_content").select("title,subtitle,content,image_url,is_active").eq("section_slug","about").eq("is_active",true).maybeSingle();
  if(error||!data)return;
  const title=getElement("[data-amasa-about-title]");
  const label=getElement("[data-amasa-about-label]");
  const p1=getElement("[data-amasa-about-p1]");
  const p2=getElement("[data-amasa-about-p2]");
  const image=getElement("[data-amasa-about-image]");
  if(label&&data.subtitle)label.textContent=data.subtitle;
  if(title&&data.title)title.textContent=data.title;
  try{
    const about=JSON.parse(data.content||"{}");
    if(p1&&about.paragraph1)p1.textContent=about.paragraph1;
    if(p2&&about.paragraph2)p2.textContent=about.paragraph2;
  }catch(e){}
  if(image&&data.image_url){
    image.innerHTML="";
    const img=document.createElement("img");
    img.src=data.image_url;
    img.alt=data.title||"AMASA";
    image.appendChild(img);
    image.classList.add("has-image");
  }
}
loadAmasaAbout();

async function loadAmasaHero(){
  if(!amasaDb)return;
  const {data,error}=await amasaDb.from("amasa_site_content").select("title,subtitle,content,image_url,button_text,button_url").eq("section_slug","hero").eq("is_active",true).maybeSingle();
  if(error||!data)return;
  const title=getElement("[data-amasa-hero-title]");
  const subtitle=getElement("[data-amasa-hero-subtitle]");
  const body=getElement("[data-amasa-hero-content]");
  const button=getElement("[data-amasa-hero-button]");
  const image=getElement("[data-amasa-hero-image]");
  if(subtitle&&data.subtitle)subtitle.textContent=data.subtitle;
  if(title&&data.title){
    const parts=data.title.split(" Untuk ");
    title.innerHTML=parts.length===2?escapeHTML(parts[0])+" <span>Untuk "+escapeHTML(parts[1])+"</span>":escapeHTML(data.title);
  }
  if(body&&data.content)body.textContent=data.content;
  if(button){
    if(data.button_text)button.textContent=data.button_text;
    if(data.button_url)button.href=data.button_url;
  }
  if(image&&data.image_url){
    image.innerHTML="";
    const img=document.createElement("img");
    img.src=data.image_url;
    img.alt=data.title||"AMASA";
    image.appendChild(img);
    image.classList.add("has-image");
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

      <div
        style="
          aspect-ratio:16/9;
          display:grid;
          place-items:center;
          border-radius:12px;
          background:
            linear-gradient(145deg,#e8ecef,#c4cdd3);
          color:#667383;
          font-weight:800;
          letter-spacing:.12em;
        ">

        AMASA GALLERY ${escapeHTML(galleryId)}

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


getElements("[data-video]").forEach((item) => {

  item.addEventListener("click", () => {

    const videoId =
      item.getAttribute("data-video");


    if (!videoModal || !videoModalContent) {
      return;
    }


    const videoTitles = {

      "linen-spray":
        "Linen Spray Anti Tungau",

      "pelicin":
        "Pelicin Pakaian",

      "parfum":
        "Parfum Mobil",

      "wiper":
        "Wiper Fluid"

    };


    const title =
      videoTitles[videoId] ||
      "Video AMASA";


    videoModalContent.innerHTML = `

      <div
        style="
          aspect-ratio:16/9;
          display:grid;
          place-items:center;
          border-radius:12px;
          background:#0b1827;
          color:#fff;
          font-size:40px;
        ">

        ▶

      </div>

      <h3 style="margin-top:20px;">
        ${escapeHTML(title)}
      </h3>

      <p style="color:#667383;">
        Video produk dapat dihubungkan ke file video,
        YouTube, atau sumber video resmi melalui halaman admin.
      </p>

    `;


    openModal(videoModal);

  });

});


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