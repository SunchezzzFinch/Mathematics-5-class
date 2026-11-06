'use client';

import React from 'react';
import { VisualizerType, WorldTheme } from '@/types/tutor';
import { NumberLineVisualizer } from './NumberLineVisualizer';
import { FractionLabVisualizer } from './FractionLabVisualizer';
import { Geometry3DVisualizer } from './Geometry3DVisualizer';
import { ProtractorVisualizer } from './ProtractorVisualizer';
import { OrderOfOperationsTree } from './OrderOfOperationsTree';

interface VisualizerHostProps {
  type: VisualizerType;
  worldTheme?: WorldTheme;
}

export function VisualizerHost({ type }: VisualizerHostProps) {
  switch (type) {
    case 'number_line':
      return <NumberLineVisualizer min={0} max={50} step={10} />;
    case 'fraction_lab':
      return <FractionLabVisualizer initialNumerator={3} initialDenominator={4} />;
    case 'geometry_3d':
      return <Geometry3DVisualizer initialLength={4} initialWidth={3} initialHeight={2} />;
    case 'protractor':
      return <ProtractorVisualizer initialAngle={54} />;
    case 'order_of_ops':
    case 'order_tree':
      return <OrderOfOperationsTree />;
    default:
      return null;
  }
}
