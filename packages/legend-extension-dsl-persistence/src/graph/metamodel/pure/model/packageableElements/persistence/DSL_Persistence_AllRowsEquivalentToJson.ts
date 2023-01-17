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

import { hashArray, type Hashable } from '@finos/legend-shared';
import { PERSISTENCE_HASH_STRUCTURE } from '../../../../../DSL_Persistence_HashUtils.js';
import type { ExternalFormatData } from '@finos/legend-graph';
import { TestAssertion, type TestAssertionVisitor } from '@finos/legend-graph';

export class AllRowsEquivalentToJson extends TestAssertion implements Hashable {
  expected!: ExternalFormatData;

  get hashCode(): string {
    return hashArray([
      PERSISTENCE_HASH_STRUCTURE.ALL_ROWS_EQUIVALENT_TO_JSON,
      this.id,
      this.expected,
    ]);
  }

  accept_TestAssertionVisitor<T>(visitor: TestAssertionVisitor<T>): T {
    return visitor.visit_TestAssertion(this);
  }
}
