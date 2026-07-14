import React from 'react';
import { PIPELINE_STAGES, STAGE_META } from '../common/stageMeta';

/**
 * A single horizontal progress line across the four pipeline stages, with a
 * count of how many active applications currently sit at each one. This is
 * deliberately separate from the kanban board below it: the board shows
 * *which* applications are where, this shows *how far the pipeline runs*.
 */
export default function PipelineTrack({ applications }) {
  const counts = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = applications.filter((a) => a.stage === stage).length;
    return acc;
  }, {});

  // "reached" = at least one application is at this stage or further along
  const furthestIndex = applications.reduce((max, app) => {
    const idx = PIPELINE_STAGES.indexOf(app.stage);
    return Math.max(max, idx);
  }, -1);

  return (
    <div className="cp-pipeline-track" role="img" aria-label="Application pipeline overview">
      {PIPELINE_STAGES.map((stage, i) => (
        <div className="cp-pipeline-node-col" key={stage}>
          <div className={`cp-pipeline-line${i - 1 < furthestIndex ? ' is-complete' : ''}`} aria-hidden="true" />
          <div className={`cp-pipeline-node${i <= furthestIndex ? ' is-active' : ''}`}>{i + 1}</div>
          <div className="cp-pipeline-node-label">{STAGE_META[stage].label}</div>
          <div className="cp-pipeline-node-count">{counts[stage]} active</div>
        </div>
      ))}
    </div>
  );
}
