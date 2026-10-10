/**
 * VR Portal Page - Main entry point for immersive VR experience
 * 
 * Mounts the production VR Portal component with AEGENTIS integration
 */

import React, { useState } from 'react';
import VRPortalReal from '@/components/VRPortalReal';

const VRPortalPage: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'disconnected'>('idle');

  const handleConnect = () => {
    setConnectionStatus('connected');
    console.log('[VR Portal Page] Connected to VR');
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    console.log('[VR Portal Page] Disconnected from VR');
  };

  return (
    <div className="vr-portal-page">
      <VRPortalReal
        enabled={true}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
};

export default VRPortalPage;
