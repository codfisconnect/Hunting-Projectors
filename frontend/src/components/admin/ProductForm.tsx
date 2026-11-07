import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { getCategories } from '../../services/productService';
import { Product } from '../../types/product';
import { Category } from '../../types/category';

interface ProductFormProps {
  product?: Product | null; // null = create mode
  onSave: (product: Product) => void;
  onCancel: () => void;
}

type SectionKey = 'basic' | 'pricing' | 'specs' | 'flags';

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const SECTION_LABELS: Record<SectionKey, string> = {
  basic: 'Basic Information',
  pricing: 'Pricing & Inventory',
  specs: 'Projector Specifications',
  flags: 'Display Flags & Badge',
};

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const isEdit = !!product;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    basic: true,
    pricing: true,
    specs: false,
    flags: false,
  });

  // Form state
  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [sku, setSku] = useState(product?.sku ?? '');
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '');
  const [subtitle, setSubtitle] = useState(product?.subtitle ?? '');
  const [tagline, setTagline] = useState(product?.tagline ?? '');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? '');
  const [description, setDescription] = useState(
    Array.isArray(product?.description) ? product.description.join('\n') : ''
  );

  // Pricing
  const [price, setPrice] = useState<string>(product?.price ? String(product.price) : '');
  const [mrp, setMrp] = useState<string>(product?.mrp ? String(product.mrp) : '');
  const [compareAtPrice, setCompareAtPrice] = useState<string>(
    product?.compareAtPrice ? String(product.compareAtPrice) : ''
  );
  const [stock, setStock] = useState<string>(product?.stock !== undefined ? String(product.stock) : '0');
  const [availability, setAvailability] = useState(product?.availability ?? 'in-stock');
  const [warranty, setWarranty] = useState(product?.warranty ?? '2 Years Official Brand Warranty');

  // Specs
  const specs = product?.specifications;
  const [resolution, setResolution] = useState(specs?.resolution ?? '');
  const [brightness, setBrightness] = useState(specs?.brightness ?? '');
  const [projectionSize, setProjectionSize] = useState(specs?.projectionSize ?? '');
  const [supportedResolution, setSupportedResolution] = useState(specs?.supportedResolution ?? '');
  const [displayTechnology, setDisplayTechnology] = useState(specs?.displayTechnology ?? '');
  const [lightSource, setLightSource] = useState(specs?.lightSource ?? '');
  const [contrastRatio, setContrastRatio] = useState(specs?.contrastRatio ?? '');
  const [throwRatio, setThrowRatio] = useState(specs?.throwRatio ?? '');
  const [operatingSystem, setOperatingSystem] = useState(specs?.operatingSystem ?? '');
  const [audio, setAudio] = useState(specs?.audio ?? '');
  const [connectivity, setConnectivity] = useState(
    Array.isArray(specs?.connectivity) ? specs.connectivity.join(', ') : ''
  );
  const [refreshRate, setRefreshRate] = useState(specs?.refreshRate ?? '');
  const [inputLag, setInputLag] = useState(specs?.inputLag ?? '');
  const [hdr, setHdr] = useState(specs?.hdr ?? '');
  const [ram, setRam] = useState(specs?.ram ?? '');
  const [storage, setStorage] = useState(specs?.storage ?? '');
  const [lampLifeHours, setLampLifeHours] = useState(specs?.lampLifeHours ?? '');
  const [dimensions, setDimensions] = useState(specs?.dimensions ?? '');
  const [weight, setWeight] = useState(specs?.weight ?? '');
  const [powerConsumption, setPowerConsumption] = useState(specs?.powerConsumption ?? '');
  const [noiseLevel, setNoiseLevel] = useState(specs?.noiseLevel ?? '');
  const [focusType, setFocusType] = useState(specs?.focusType ?? '');
  const [keystoneCorrection, setKeystoneCorrection] = useState(specs?.keystoneCorrection ?? '');

  // Flags
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isFlagship, setIsFlagship] = useState(product?.isFlagship ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [badge, setBadge] = useState(product?.badge ?? '');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Auto-generate slug from name (unless user has manually edited it)
  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  const toggleSection = (key: SectionKey) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError('Product name is required.'); return; }
    if (!slug.trim()) { setError('Slug is required.'); return; }
    if (!categoryId) { setError('Category is required.'); return; }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('A valid price is required.'); return;
    }

    const connectivityArr = connectivity
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    const payload: Record<string, any> = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      sku: sku.trim() || undefined,
      categoryId,
      subtitle: subtitle.trim(),
      tagline: tagline.trim(),
      shortDescription: shortDescription.trim(),
      description: description.split('\n').map((l: string) => l.trim()).filter(Boolean),
      price: Number(price),
      mrp: mrp ? Number(mrp) : undefined,
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock) || 0,
      availability,
      warranty: warranty.trim(),
      isActive,
      isNew,
      isFeatured,
      isFlagship,
      isBestSeller,
      badge: badge.trim() || undefined,
      specifications: {
        resolution: resolution.trim(),
        brightness: brightness.trim(),
        projectionSize: projectionSize.trim(),
        supportedResolution: supportedResolution.trim() || undefined,
        displayTechnology: displayTechnology.trim(),
        lightSource: lightSource.trim(),
        contrastRatio: contrastRatio.trim(),
        throwRatio: throwRatio.trim(),
        operatingSystem: operatingSystem.trim(),
        audio: audio.trim(),
        connectivity: connectivityArr.length ? connectivityArr : undefined,
        refreshRate: refreshRate.trim() || undefined,
        inputLag: inputLag.trim() || undefined,
        hdr: hdr.trim() || undefined,
        ram: ram.trim() || undefined,
        storage: storage.trim() || undefined,
        lampLifeHours: lampLifeHours.trim() || undefined,
        dimensions: dimensions.trim() || undefined,
        weight: weight.trim() || undefined,
        powerConsumption: powerConsumption.trim() || undefined,
        noiseLevel: noiseLevel.trim() || undefined,
        focusType: focusType.trim() || undefined,
        keystoneCorrection: keystoneCorrection.trim() || undefined,
      },
    };

    setSaving(true);
    try {
      let saved: Product;
      if (isEdit && product) {
        saved = await adminService.updateProduct(product.id, payload);
      } else {
        saved = await adminService.createProduct(payload);
      }
      onSave(saved);
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const Section: React.FC<{ id: SectionKey; children: React.ReactNode }> = ({ id, children }) => (
    <div className="pf-section">
      <button
        type="button"
        className="pf-section-header"
        onClick={() => toggleSection(id)}
      >
        <span>{SECTION_LABELS[id]}</span>
        {openSections[id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {openSections[id] && <div className="pf-section-body">{children}</div>}
    </div>
  );

  const Field: React.FC<{
    label: string; required?: boolean; hint?: string; children: React.ReactNode;
  }> = ({ label, required, hint, children }) => (
    <div className="pf-field">
      <label className="pf-label">
        {label}{required && <span className="pf-required"> *</span>}
      </label>
      {children}
      {hint && <span className="pf-hint">{hint}</span>}
    </div>
  );

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div
        className="pf-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit Product' : 'Add New Product'}
      >
        {/* Header */}
        <div className="pf-modal-header">
          <h2 className="pf-modal-title">{isEdit ? `Edit: ${product!.name}` : 'Add New Product'}</h2>
          <button type="button" className="modal-close" onClick={onCancel} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {error && <div className="pf-error-banner">{error}</div>}

        <form className="pf-form" onSubmit={handleSubmit} noValidate>
          <div className="pf-form-scroll">

            {/* ── BASIC INFORMATION ── */}
            <Section id="basic">
              <div className="pf-row-2">
                <Field label="Product Name" required>
                  <input
                    type="text" value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Hunting Vision X1 Pro"
                    className="pf-input"
                  />
                </Field>
                <Field label="Slug" required hint="Auto-generated; lowercase, hyphens only">
                  <input
                    type="text" value={slug}
                    onChange={e => { setSlug(e.target.value); setSlugTouched(true); }}
                    placeholder="hunting-vision-x1-pro"
                    className="pf-input"
                  />
                </Field>
              </div>
              <div className="pf-row-2">
                <Field label="SKU" hint="Optional — must be unique if provided">
                  <input
                    type="text" value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder="HP-VX1-PRO"
                    className="pf-input"
                  />
                </Field>
                <Field label="Category" required>
                  <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="pf-input">
                    <option value="">— Select Category —</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Subtitle" hint="One-line product tagline shown in listing cards">
                <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="pf-input" placeholder="e.g. 4K Laser Home Cinema Projector" />
              </Field>
              <Field label="Tagline" hint="Short marketing line shown in hero sections">
                <input type="text" value={tagline} onChange={e => setTagline(e.target.value)} className="pf-input" placeholder="e.g. See Beyond Reality" />
              </Field>
              <Field label="Short Description">
                <textarea rows={2} value={shortDescription} onChange={e => setShortDescription(e.target.value)} className="pf-input pf-textarea" placeholder="A single compelling sentence about the product." />
              </Field>
              <Field label="Full Description" hint="One paragraph per line; each becomes a separate bullet on the product page">
                <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)} className="pf-input pf-textarea" placeholder="Line 1 — key benefit&#10;Line 2 — another benefit" />
              </Field>
            </Section>

            {/* ── PRICING & INVENTORY ── */}
            <Section id="pricing">
              <div className="pf-row-3">
                <Field label="Price (₹)" required>
                  <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="pf-input" placeholder="85000" />
                </Field>
                <Field label="MRP (₹)" hint="Manufacturer's listed price">
                  <input type="number" min="0" step="0.01" value={mrp} onChange={e => setMrp(e.target.value)} className="pf-input" placeholder="95000" />
                </Field>
                <Field label="Compare-at Price (₹)" hint="Strikethrough price on storefront">
                  <input type="number" min="0" step="0.01" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)} className="pf-input" placeholder="95000" />
                </Field>
              </div>
              <div className="pf-row-3">
                <Field label="Stock (units)">
                  <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} className="pf-input" placeholder="10" />
                </Field>
                <Field label="Availability">
                  <select value={availability} onChange={e => setAvailability(e.target.value)} className="pf-input">
                    <option value="in-stock">In Stock</option>
                    <option value="pre-order">Pre-Order</option>
                    <option value="demo-available">Demo Available</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </Field>
                <Field label="Warranty">
                  <input type="text" value={warranty} onChange={e => setWarranty(e.target.value)} className="pf-input" placeholder="2 Years Official Brand Warranty" />
                </Field>
              </div>
            </Section>

            {/* ── PROJECTOR SPECIFICATIONS ── */}
            <Section id="specs">
              <div className="pf-row-2">
                <Field label="Resolution" hint="e.g. 4K UHD (3840×2160)">
                  <input type="text" value={resolution} onChange={e => setResolution(e.target.value)} className="pf-input" placeholder="4K UHD (3840×2160)" />
                </Field>
                <Field label="Supported Resolution">
                  <input type="text" value={supportedResolution} onChange={e => setSupportedResolution(e.target.value)} className="pf-input" placeholder="Up to 8K" />
                </Field>
              </div>
              <div className="pf-row-2">
                <Field label="Brightness / Lumens" hint="Maps to brightness field">
                  <input type="text" value={brightness} onChange={e => setBrightness(e.target.value)} className="pf-input" placeholder="2,500 ANSI Lumens" />
                </Field>
                <Field label="Max Screen Size" hint="Maps to projectionSize field">
                  <input type="text" value={projectionSize} onChange={e => setProjectionSize(e.target.value)} className="pf-input" placeholder='40" – 200" Diagonal' />
                </Field>
              </div>
              <div className="pf-row-2">
                <Field label="Display Technology">
                  <input type="text" value={displayTechnology} onChange={e => setDisplayTechnology(e.target.value)} className="pf-input" placeholder="DLP Optical Engine" />
                </Field>
                <Field label="Light Source">
                  <input type="text" value={lightSource} onChange={e => setLightSource(e.target.value)} className="pf-input" placeholder="Solid-State Laser" />
                </Field>
              </div>
              <div className="pf-row-2">
                <Field label="Contrast Ratio">
                  <input type="text" value={contrastRatio} onChange={e => setContrastRatio(e.target.value)} className="pf-input" placeholder="1,000,000:1 Dynamic" />
                </Field>
                <Field label="Throw Ratio">
                  <input type="text" value={throwRatio} onChange={e => setThrowRatio(e.target.value)} className="pf-input" placeholder="1.2:1" />
                </Field>
              </div>
              <div className="pf-row-2">
                <Field label="Operating System">
                  <input type="text" value={operatingSystem} onChange={e => setOperatingSystem(e.target.value)} className="pf-input" placeholder="Hunting Smart OS 2.0" />
                </Field>
                <Field label="Audio">
                  <input type="text" value={audio} onChange={e => setAudio(e.target.value)} className="pf-input" placeholder="2×10W Stereo Speakers" />
                </Field>
              </div>
              <Field label="Connectivity" hint="Comma-separated list, e.g. HDMI, USB, Wi-Fi, Bluetooth">
                <input type="text" value={connectivity} onChange={e => setConnectivity(e.target.value)} className="pf-input" placeholder="HDMI 2.1, USB 3.0, Wi-Fi 6, Bluetooth 5.2" />
              </Field>
              <div className="pf-row-3">
                <Field label="Refresh Rate">
                  <input type="text" value={refreshRate} onChange={e => setRefreshRate(e.target.value)} className="pf-input" placeholder="60 Hz" />
                </Field>
                <Field label="Input Lag">
                  <input type="text" value={inputLag} onChange={e => setInputLag(e.target.value)} className="pf-input" placeholder="16 ms" />
                </Field>
                <Field label="HDR">
                  <input type="text" value={hdr} onChange={e => setHdr(e.target.value)} className="pf-input" placeholder="HDR10 / HLG" />
                </Field>
              </div>
              <div className="pf-row-2">
                <Field label="RAM">
                  <input type="text" value={ram} onChange={e => setRam(e.target.value)} className="pf-input" placeholder="2 GB" />
                </Field>
                <Field label="Storage">
                  <input type="text" value={storage} onChange={e => setStorage(e.target.value)} className="pf-input" placeholder="16 GB eMMC" />
                </Field>
              </div>
              <div className="pf-row-2">
                <Field label="Lamp Life">
                  <input type="text" value={lampLifeHours} onChange={e => setLampLifeHours(e.target.value)} className="pf-input" placeholder="30,000+ Hours" />
                </Field>
                <Field label="Focus Type">
                  <input type="text" value={focusType} onChange={e => setFocusType(e.target.value)} className="pf-input" placeholder="Auto Focus" />
                </Field>
              </div>
              <div className="pf-row-2">
                <Field label="Keystone Correction">
                  <input type="text" value={keystoneCorrection} onChange={e => setKeystoneCorrection(e.target.value)} className="pf-input" placeholder="±45° Auto Keystone" />
                </Field>
                <Field label="Noise Level">
                  <input type="text" value={noiseLevel} onChange={e => setNoiseLevel(e.target.value)} className="pf-input" placeholder="< 25 dB" />
                </Field>
              </div>
              <div className="pf-row-3">
                <Field label="Dimensions">
                  <input type="text" value={dimensions} onChange={e => setDimensions(e.target.value)} className="pf-input" placeholder="220 × 200 × 140 mm" />
                </Field>
                <Field label="Weight">
                  <input type="text" value={weight} onChange={e => setWeight(e.target.value)} className="pf-input" placeholder="3.5 kg" />
                </Field>
                <Field label="Power Consumption">
                  <input type="text" value={powerConsumption} onChange={e => setPowerConsumption(e.target.value)} className="pf-input" placeholder="120W" />
                </Field>
              </div>
            </Section>

            {/* ── FLAGS & BADGE ── */}
            <Section id="flags">
              <div className="pf-flags-grid">
                {[
                  { label: 'Active (visible on storefront)', value: isActive, setter: setIsActive },
                  { label: 'New Arrival badge', value: isNew, setter: setIsNew },
                  { label: 'Featured on homepage', value: isFeatured, setter: setIsFeatured },
                  { label: 'Flagship model', value: isFlagship, setter: setIsFlagship },
                  { label: 'Best Seller label', value: isBestSeller, setter: setIsBestSeller },
                ].map(({ label, value, setter }) => (
                  <label key={label} className="pf-toggle-row">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={e => setter(e.target.checked)}
                      className="pf-checkbox"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <Field label="Custom Badge Text" hint="Short label shown on product card, e.g. NEW, SALE, HOT">
                <input type="text" value={badge} onChange={e => setBadge(e.target.value)} className="pf-input" placeholder="FLAGSHIP" maxLength={20} />
              </Field>
            </Section>

          </div>

          {/* Footer actions */}
          <div className="pf-modal-footer">
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

