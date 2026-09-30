import React from 'react';
import { Cable, Disc, Wifi, Radio, Zap } from 'lucide-react';
import './ProductConnectivity.css';

interface ProductConnectivityProps {
  connectivity: string[];
}

export const ProductConnectivity: React.FC<ProductConnectivityProps> = ({ connectivity }) => {
  const portsList = [
    { name: 'HDMI 2.1 (eARC / ARC)', spec: '48Gbps uncompressed Dolby Atmos & DTS:X audio pass-through to AV receivers and soundbars.', icon: <Cable size={18} /> },
    { name: 'Dual USB 3.0 High-Speed', spec: 'Direct playback of high-bitrate 4K MKV files from external SSDs and thumb drives.', icon: <Disc size={18} /> },
    { name: 'Optical Audio (Toslink S/PDIF)', spec: 'Lossless multi-channel digital audio output for legacy soundbars and DAC systems.', icon: <Zap size={18} /> },
    { name: 'Wi-Fi 6 (Dual Band 2.4/5GHz)', spec: 'Ultra-low latency uncompressed wireless streaming without buffering artifacts.', icon: <Wifi size={18} /> },
    { name: 'Bidirectional Bluetooth 5.2', spec: 'Connect wireless ANC headphones or use the projector as an independent high-res speaker.', icon: <Radio size={18} /> },
  ];

  return (
    <section className="product-connectivity-section" aria-label="Rear Panel Connectivity">
      <div className="connectivity-header">
        <span className="eyebrow">INPUT / OUTPUT INTERFACE</span>
        <h2 className="display-section">UNIVERSAL CONNECTIVITY</h2>
        <p className="connectivity-sub">
          Engineered for seamless integration with PlayStation 5, Xbox Series X, Apple TV 4K, Fire TV Cube, and reference home cinema soundbars.
        </p>
      </div>

      <div className="connectivity-diagram-card">
        {/* Visual Rear Ports Diagram */}
        <div className="ports-visual-chassis">
          <div className="chassis-bracket">
            <div className="port-pin-block">
              <span className="pin-title">HDMI 1 (eARC)</span>
              <div className="hdmi-slot gold" />
            </div>
            <div className="port-pin-block">
              <span className="pin-title">HDMI 2</span>
              <div className="hdmi-slot" />
            </div>
            <div className="port-pin-block">
              <span className="pin-title">USB 3.0</span>
              <div className="usb-slot blue" />
            </div>
            <div className="port-pin-block">
              <span className="pin-title">OPTICAL</span>
              <div className="optical-slot red" />
            </div>
            <div className="port-pin-block">
              <span className="pin-title">LAN / RJ45</span>
              <div className="lan-slot" />
            </div>
            <div className="port-pin-block">
              <span className="pin-title">AC POWER</span>
              <div className="power-slot" />
            </div>
          </div>
        </div>

        {/* Ports Detail List */}
        <div className="ports-detail-grid">
          {portsList.map((p, i) => (
            <div key={i} className="port-desc-item">
              <div className="port-icon-circle">{p.icon}</div>
              <div>
                <h4 className="port-item-name">{p.name}</h4>
                <p className="port-item-spec">{p.spec}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
