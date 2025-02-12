/**
 * Copyright (c) 2020-present, Goldman Sachs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { makeObservable, observable } from 'mobx';
import { type DataSpaceViewerState } from './DataSpaceViewerState.js';
import { DataAccessState } from '@finos/legend-query-builder';
import {
  DataSpaceServiceExecutableInfo,
  type DataSpaceExecutableAnalysisResult,
} from '../graph-manager/action/analytics/DataSpaceAnalysis.js';

export class DataSpaceQuickStartState {
  readonly dataSpaceViewerState: DataSpaceViewerState;

  dataAccessStateIndex = new Map<
    DataSpaceExecutableAnalysisResult,
    DataAccessState
  >();

  constructor(dataSpaceViewerState: DataSpaceViewerState) {
    makeObservable(this, {
      dataAccessStateIndex: observable,
    });

    this.dataSpaceViewerState = dataSpaceViewerState;
    dataSpaceViewerState.dataSpaceAnalysisResult.executables.forEach(
      (executable) => {
        let dataAccessState: DataAccessState | undefined;

        if (
          executable.info instanceof DataSpaceServiceExecutableInfo &&
          executable.info.mapping &&
          executable.info.runtime
        ) {
          const mapping = executable.info.mapping;
          const runtime = executable.info.runtime;
          dataAccessState = new DataAccessState(
            this.dataSpaceViewerState.applicationStore,
            this.dataSpaceViewerState.graphManagerState,
            {
              initialDatasets: executable.datasets,
              mapping,
              runtime,
              graphData: this.dataSpaceViewerState.retrieveGraphData(),
              // TODO: we need to find a way to unify this code logic with the check in query builder
              // and avoid the need to send over (dummy) parameter values in order to make the survey datasets
              // call
              // We need to also cache the datasets survey result with query as scope in addition to the work done in
              // https://github.com/finos/legend-engine/pull/1678
              getQuery: async () => undefined,
              // getQuery: () =>
              //   this.dataSpaceViewerState.graphManagerState.graphManager.pureCodeToLambda(
              //     query,
              //   ),
            },
          );
        }

        if (dataAccessState) {
          this.dataAccessStateIndex.set(executable, dataAccessState);
        }
      },
    );
  }
}
