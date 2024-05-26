/******/ (() => {
  // webpackBootstrap
  /******/ var __webpack_modules__ = {
    /***/ "./node_modules/json-stringify-safe/stringify.js":
      /*!*******************************************************!*\
  !*** ./node_modules/json-stringify-safe/stringify.js ***!
  \*******************************************************/
      /***/ (module, exports) => {
        exports = module.exports = stringify;
        exports.getSerialize = serializer;

        function stringify(obj, replacer, spaces, cycleReplacer) {
          return JSON.stringify(
            obj,
            serializer(replacer, cycleReplacer),
            spaces,
          );
        }

        function serializer(replacer, cycleReplacer) {
          var stack = [],
            keys = [];

          if (cycleReplacer == null)
            cycleReplacer = function (key, value) {
              if (stack[0] === value) return "[Circular ~]";
              return (
                "[Circular ~." +
                keys.slice(0, stack.indexOf(value)).join(".") +
                "]"
              );
            };

          return function (key, value) {
            if (stack.length > 0) {
              var thisPos = stack.indexOf(this);
              ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
              ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
              if (~stack.indexOf(value))
                value = cycleReplacer.call(this, key, value);
            } else stack.push(value);

            return replacer == null ? value : replacer.call(this, key, value);
          };
        }

        /***/
      },

    /***/ "./node_modules/poly-decomp-es/dist/poly-decomp-es.js":
      /*!************************************************************!*\
  !*** ./node_modules/poly-decomp-es/dist/poly-decomp-es.js ***!
  \************************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__,
      ) => {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ decomp: () => /* binding */ decomp,
          /* harmony export */ isSimple: () => /* binding */ isSimple,
          /* harmony export */ makeCCW: () => /* binding */ makeCCW,
          /* harmony export */ quickDecomp: () => /* binding */ quickDecomp,
          /* harmony export */ removeCollinearPoints: () =>
            /* binding */ removeCollinearPoints,
          /* harmony export */ removeDuplicatePoints: () =>
            /* binding */ removeDuplicatePoints,
          /* harmony export */
        });
        const tmpPoint1 = [0, 0];
        const tmpPoint2 = [0, 0];
        const tmpLine1 = [
          [0, 0],
          [0, 0],
        ];
        const tmpLine2 = [
          [0, 0],
          [0, 0],
        ];

        /**
         * Compute the intersection between two lines.
         * @param l1 Line vector 1
         * @param l2 Line vector 2
         * @param precision Precision to use when checking if the lines are parallel
         * @return The intersection point.
         */
        function lineInt(l1, l2, precision) {
          if (precision === void 0) {
            precision = 0;
          }
          precision = precision || 0;
          const i = [0, 0]; // point
          const a1 = l1[1][1] - l1[0][1];
          const b1 = l1[0][0] - l1[1][0];
          const c1 = a1 * l1[0][0] + b1 * l1[0][1];
          const a2 = l2[1][1] - l2[0][1];
          const b2 = l2[0][0] - l2[1][0];
          const c2 = a2 * l2[0][0] + b2 * l2[0][1];
          const det = a1 * b2 - a2 * b1;
          if (!scalarsEqual(det, 0, precision)) {
            // lines are not parallel
            i[0] = (b2 * c1 - b1 * c2) / det;
            i[1] = (a1 * c2 - a2 * c1) / det;
          }
          return i;
        }

        /**
         * Checks if two line segments intersects.
         * @param p1 The start vertex of the first line segment.
         * @param p2 The end vertex of the first line segment.
         * @param q1 The start vertex of the second line segment.
         * @param q2 The end vertex of the second line segment.
         * @return True if the two line segments intersect
         */
        function lineSegmentsIntersect(p1, p2, q1, q2) {
          const dx = p2[0] - p1[0];
          const dy = p2[1] - p1[1];
          const da = q2[0] - q1[0];
          const db = q2[1] - q1[1];

          // segments are parallel
          if (da * dy - db * dx === 0) {
            return false;
          }
          const s =
            (dx * (q1[1] - p1[1]) + dy * (p1[0] - q1[0])) / (da * dy - db * dx);
          const t =
            (da * (p1[1] - q1[1]) + db * (q1[0] - p1[0])) / (db * dx - da * dy);
          return s >= 0 && s <= 1 && t >= 0 && t <= 1;
        }

        /**
         * Get the area of a triangle spanned by the three given points. Note that the area will be negative if the points are not given in counter-clockwise order.
         * @param a point 1
         * @param b point 2
         * @param c point 3
         * @return the area of a triangle spanned by the three given points
         */
        function triangleArea(a, b, c) {
          return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
        }
        function isLeft(a, b, c) {
          return triangleArea(a, b, c) > 0;
        }
        function isLeftOn(a, b, c) {
          return triangleArea(a, b, c) >= 0;
        }
        function isRight(a, b, c) {
          return triangleArea(a, b, c) < 0;
        }
        function isRightOn(a, b, c) {
          return triangleArea(a, b, c) <= 0;
        }

        /**
         * Check if three points are collinear
         * @param a point 1
         * @param b point 2
         * @param c point 3
         * @param thresholdAngle angle to use when comparing the vectors. The function will return true if the angle between the resulting vectors is less than this value. Use zero for max precision.
         * @return whether the points are collinear
         */
        function collinear(a, b, c, thresholdAngle) {
          if (thresholdAngle === void 0) {
            thresholdAngle = 0;
          }
          if (!thresholdAngle) {
            return triangleArea(a, b, c) === 0;
          } else {
            const ab = tmpPoint1;
            const bc = tmpPoint2;
            ab[0] = b[0] - a[0];
            ab[1] = b[1] - a[1];
            bc[0] = c[0] - b[0];
            bc[1] = c[1] - b[1];
            const dot = ab[0] * bc[0] + ab[1] * bc[1];
            const magA = Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1]);
            const magB = Math.sqrt(bc[0] * bc[0] + bc[1] * bc[1]);
            const angle = Math.acos(dot / (magA * magB));
            return angle < thresholdAngle;
          }
        }
        function sqdist(a, b) {
          const dx = b[0] - a[0];
          const dy = b[1] - a[1];
          return dx * dx + dy * dy;
        }

        /**
         * Get a vertex at position i. It does not matter if i is out of bounds, this function will just cycle.
         * @param i vertex position
         * @return vertex at position i
         */
        function polygonAt(polygon, i) {
          const s = polygon.length;
          return polygon[i < 0 ? (i % s) + s : i % s];
        }

        /**
         * Clear the polygon data
         */
        function polygonClear(polygon) {
          polygon.length = 0;
        }

        /**
         * Append points "from" to "to" -1 from an other polygon "poly" onto this one.
         * @param polygon the polygon to append to
         * @param poly The polygon to get points from.
         * @param from The vertex index in "poly".
         * @param to The end vertex index in "poly". Note that this vertex is NOT included when appending.
         */
        function polygonAppend(polygon, poly, from, to) {
          for (let i = from; i < to; i++) {
            polygon.push(poly[i]);
          }
        }

        /**
         * Make sure that the polygon vertices are ordered counter-clockwise.
         */
        function makeCCW(polygon) {
          let br = 0;
          const v = polygon;

          // find bottom right point
          for (let i = 1; i < polygon.length; ++i) {
            if (
              v[i][1] < v[br][1] ||
              (v[i][1] === v[br][1] && v[i][0] > v[br][0])
            ) {
              br = i;
            }
          }

          // reverse poly if clockwise
          if (
            !isLeft(
              polygonAt(polygon, br - 1),
              polygonAt(polygon, br),
              polygonAt(polygon, br + 1),
            )
          ) {
            polygonReverse(polygon);
            return true;
          } else {
            return false;
          }
        }

        /**
         * Reverse the vertices in the polygon
         */
        function polygonReverse(polygon) {
          const tmp = [];
          const N = polygon.length;
          for (let i = 0; i !== N; i++) {
            tmp.push(polygon.pop());
          }
          for (let i = 0; i !== N; i++) {
            polygon[i] = tmp[i];
          }
        }

        /**
         * Check if a point in the polygon is a reflex point
         * @param i the point in the polygon to check
         * @return whether the given point in the polygon is a reflex point
         */
        function polygonIsReflex(polygon, i) {
          return isRight(
            polygonAt(polygon, i - 1),
            polygonAt(polygon, i),
            polygonAt(polygon, i + 1),
          );
        }

        /**
         * Check if two vertices in the polygon can see each other
         * @param a vertex index 1
         * @param b vertex index 2
         * @return whether two vertices in the polygon can see each other
         */
        function polygonCanSee(polygon, a, b) {
          const l1 = tmpLine1;
          const l2 = tmpLine2;
          if (
            isLeftOn(
              polygonAt(polygon, a + 1),
              polygonAt(polygon, a),
              polygonAt(polygon, b),
            ) &&
            isRightOn(
              polygonAt(polygon, a - 1),
              polygonAt(polygon, a),
              polygonAt(polygon, b),
            )
          ) {
            return false;
          }
          const dist = sqdist(polygonAt(polygon, a), polygonAt(polygon, b));
          for (let i = 0; i !== polygon.length; ++i) {
            // for each edge
            if ((i + 1) % polygon.length === a || i === a) {
              // ignore incident edges
              continue;
            }
            if (
              isLeftOn(
                polygonAt(polygon, a),
                polygonAt(polygon, b),
                polygonAt(polygon, i + 1),
              ) &&
              isRightOn(
                polygonAt(polygon, a),
                polygonAt(polygon, b),
                polygonAt(polygon, i),
              )
            ) {
              // if diag intersects an edge
              l1[0] = polygonAt(polygon, a);
              l1[1] = polygonAt(polygon, b);
              l2[0] = polygonAt(polygon, i);
              l2[1] = polygonAt(polygon, i + 1);
              const p = lineInt(l1, l2);
              if (sqdist(polygonAt(polygon, a), p) < dist) {
                // if edge is blocking visibility to b
                return false;
              }
            }
          }
          return true;
        }

        /**
         * Check if two vertices in the polygon can see each other
         * @param a vertex index 1
         * @param b vertex index 2
         * @return if two vertices in the polygon can see each other
         */
        function polygonCanSee2(polygon, a, b) {
          // for each edge
          for (let i = 0; i !== polygon.length; ++i) {
            // ignore incident edges
            if (
              i === a ||
              i === b ||
              (i + 1) % polygon.length === a ||
              (i + 1) % polygon.length === b
            ) {
              continue;
            }
            if (
              lineSegmentsIntersect(
                polygonAt(polygon, a),
                polygonAt(polygon, b),
                polygonAt(polygon, i),
                polygonAt(polygon, i + 1),
              )
            ) {
              return false;
            }
          }
          return true;
        }

        /**
         * Copy the polygon from vertex i to vertex j.
         * @param i the start vertex to copy from
         * @param j the end vertex to copy from
         * @param targetPoly optional target polygon to save in.
         * @return the resulting copy.
         */
        function polygonCopy(polygon, i, j, targetPoly) {
          if (targetPoly === void 0) {
            targetPoly = [];
          }
          polygonClear(targetPoly);
          if (i < j) {
            // Insert all vertices from i to j
            for (let k = i; k <= j; k++) {
              targetPoly.push(polygon[k]);
            }
          } else {
            // Insert vertices 0 to j
            for (let k = 0; k <= j; k++) {
              targetPoly.push(polygon[k]);
            }

            // Insert vertices i to end
            for (let k = i; k < polygon.length; k++) {
              targetPoly.push(polygon[k]);
            }
          }
          return targetPoly;
        }

        /**
         * Decomposes the polygon into convex pieces. Returns a list of edges [[p1,p2],[p2,p3],...] that cuts the polygon.
         * Note that this algorithm has complexity O(N^4) and will be very slow for polygons with many vertices.
         * @return a list of edges that cuts the polygon
         */
        function getCutEdges(polygon) {
          let min = [];
          let tmp1;
          let tmp2;
          const tmpPoly = [];
          let nDiags = Number.MAX_VALUE;
          for (let i = 0; i < polygon.length; ++i) {
            if (polygonIsReflex(polygon, i)) {
              for (let j = 0; j < polygon.length; ++j) {
                if (polygonCanSee(polygon, i, j)) {
                  tmp1 = getCutEdges(polygonCopy(polygon, i, j, tmpPoly));
                  tmp2 = getCutEdges(polygonCopy(polygon, j, i, tmpPoly));
                  for (let k = 0; k < tmp2.length; k++) {
                    tmp1.push(tmp2[k]);
                  }
                  if (tmp1.length < nDiags) {
                    min = tmp1;
                    nDiags = tmp1.length;
                    min.push([polygonAt(polygon, i), polygonAt(polygon, j)]);
                  }
                }
              }
            }
          }
          return min;
        }

        /**
         * Decomposes the polygon into one or more convex sub-Polygons.
         * @return An array of Polygon objects, or false if decomposition fails
         */
        function decomp(polygon) {
          const edges = getCutEdges(polygon);
          if (edges.length > 0) {
            return slicePolygon(polygon, edges);
          } else {
            return [polygon];
          }
        }

        /**
         * Slices the polygon given one or more cut edges. If given one, this function will return two polygons (false on failure). If many, an array of polygons.
         * @param cutEdges A list of edges, as returned by .getCutEdges()
         * @return the sliced polygons, or false if the operation was unsuccessful
         */
        function slicePolygon(polygon, cutEdges) {
          if (cutEdges.length === 0) {
            return [polygon];
          }

          // if given multiple edges
          if (
            cutEdges instanceof Array &&
            cutEdges.length &&
            cutEdges[0] instanceof Array &&
            cutEdges[0].length === 2 &&
            cutEdges[0][0] instanceof Array
          ) {
            const polys = [polygon];
            for (let i = 0; i < cutEdges.length; i++) {
              const cutEdge = cutEdges[i];
              // Cut all polys
              for (let j = 0; j < polys.length; j++) {
                const poly = polys[j];
                const result = slicePolygon(poly, cutEdge);
                if (result) {
                  // Found poly! Cut and quit
                  polys.splice(j, 1);
                  polys.push(result[0], result[1]);
                  break;
                }
              }
            }
            return polys;
          } else {
            // Was given one edge
            const cutEdge = cutEdges;
            const i = polygon.indexOf(cutEdge[0]);
            const j = polygon.indexOf(cutEdge[1]);
            if (i !== -1 && j !== -1) {
              return [polygonCopy(polygon, i, j), polygonCopy(polygon, j, i)];
            } else {
              return false;
            }
          }
        }

        /**
         * Checks that the line segments of this polygon do not intersect each other.
         * @param polygon An array of vertices e.g. [[0,0],[0,1],...]
         * @return whether line segments of this polygon do not intersect each other.
         * @todo Should it check all segments with all others?
         */
        function isSimple(polygon) {
          const path = polygon;
          let i;

          // Check
          for (i = 0; i < path.length - 1; i++) {
            for (let j = 0; j < i - 1; j++) {
              if (
                lineSegmentsIntersect(
                  path[i],
                  path[i + 1],
                  path[j],
                  path[j + 1],
                )
              ) {
                return false;
              }
            }
          }

          // Check the segment between the last and the first point to all others
          for (i = 1; i < path.length - 2; i++) {
            if (
              lineSegmentsIntersect(
                path[0],
                path[path.length - 1],
                path[i],
                path[i + 1],
              )
            ) {
              return false;
            }
          }
          return true;
        }
        function getIntersectionPoint(p1, p2, q1, q2, delta) {
          if (delta === void 0) {
            delta = 0;
          }
          const a1 = p2[1] - p1[1];
          const b1 = p1[0] - p2[0];
          const c1 = a1 * p1[0] + b1 * p1[1];
          const a2 = q2[1] - q1[1];
          const b2 = q1[0] - q2[0];
          const c2 = a2 * q1[0] + b2 * q1[1];
          const det = a1 * b2 - a2 * b1;
          if (!scalarsEqual(det, 0, delta)) {
            return [(b2 * c1 - b1 * c2) / det, (a1 * c2 - a2 * c1) / det];
          } else {
            return [0, 0];
          }
        }

        /**
         * Quickly decompose the Polygon into convex sub-polygons.
         * @param polygon the polygon to decompose
         * @param result
         * @param reflexVertices
         * @param steinerPoints
         * @param delta
         * @param maxlevel
         * @param level
         * @return the decomposed sub-polygons
         */
        function quickDecomp(
          polygon,
          result,
          reflexVertices,
          steinerPoints,
          delta,
          maxlevel,
          level,
        ) {
          if (result === void 0) {
            result = [];
          }
          if (reflexVertices === void 0) {
            reflexVertices = [];
          }
          if (steinerPoints === void 0) {
            steinerPoints = [];
          }
          if (delta === void 0) {
            delta = 25;
          }
          if (maxlevel === void 0) {
            maxlevel = 100;
          }
          if (level === void 0) {
            level = 0;
          }
          // Points
          let upperInt = [0, 0];
          let lowerInt = [0, 0];
          let p = [0, 0];

          // scalars
          let upperDist = 0;
          let lowerDist = 0;
          let d = 0;
          let closestDist = 0;

          // Integers
          let upperIndex = 0;
          let lowerIndex = 0;
          let closestIndex = 0;

          // polygons
          const lowerPoly = [];
          const upperPoly = [];
          const poly = polygon;
          const v = polygon;
          if (v.length < 3) {
            return result;
          }
          level++;
          if (level > maxlevel) {
            console.warn("quickDecomp: max level (" + maxlevel + ") reached.");
            return result;
          }
          for (let i = 0; i < polygon.length; ++i) {
            if (polygonIsReflex(poly, i)) {
              reflexVertices.push(poly[i]);
              upperDist = lowerDist = Number.MAX_VALUE;
              for (let j = 0; j < polygon.length; ++j) {
                if (
                  isLeft(
                    polygonAt(poly, i - 1),
                    polygonAt(poly, i),
                    polygonAt(poly, j),
                  ) &&
                  isRightOn(
                    polygonAt(poly, i - 1),
                    polygonAt(poly, i),
                    polygonAt(poly, j - 1),
                  )
                ) {
                  // if line intersects with an edge
                  p = getIntersectionPoint(
                    polygonAt(poly, i - 1),
                    polygonAt(poly, i),
                    polygonAt(poly, j),
                    polygonAt(poly, j - 1),
                  ); // find the point of intersection
                  if (isRight(polygonAt(poly, i + 1), polygonAt(poly, i), p)) {
                    // make sure it's inside the poly
                    d = sqdist(poly[i], p);
                    if (d < lowerDist) {
                      // keep only the closest intersection
                      lowerDist = d;
                      lowerInt = p;
                      lowerIndex = j;
                    }
                  }
                }
                if (
                  isLeft(
                    polygonAt(poly, i + 1),
                    polygonAt(poly, i),
                    polygonAt(poly, j + 1),
                  ) &&
                  isRightOn(
                    polygonAt(poly, i + 1),
                    polygonAt(poly, i),
                    polygonAt(poly, j),
                  )
                ) {
                  p = getIntersectionPoint(
                    polygonAt(poly, i + 1),
                    polygonAt(poly, i),
                    polygonAt(poly, j),
                    polygonAt(poly, j + 1),
                  );
                  if (isLeft(polygonAt(poly, i - 1), polygonAt(poly, i), p)) {
                    d = sqdist(poly[i], p);
                    if (d < upperDist) {
                      upperDist = d;
                      upperInt = p;
                      upperIndex = j;
                    }
                  }
                }
              }

              // if there are no vertices to connect to, choose a point in the middle
              if (lowerIndex === (upperIndex + 1) % polygon.length) {
                p[0] = (lowerInt[0] + upperInt[0]) / 2;
                p[1] = (lowerInt[1] + upperInt[1]) / 2;
                steinerPoints.push(p);
                if (i < upperIndex) {
                  polygonAppend(lowerPoly, poly, i, upperIndex + 1);
                  lowerPoly.push(p);
                  upperPoly.push(p);
                  if (lowerIndex !== 0) {
                    polygonAppend(upperPoly, poly, lowerIndex, poly.length);
                  }
                  polygonAppend(upperPoly, poly, 0, i + 1);
                } else {
                  if (i !== 0) {
                    polygonAppend(lowerPoly, poly, i, poly.length);
                  }
                  polygonAppend(lowerPoly, poly, 0, upperIndex + 1);
                  lowerPoly.push(p);
                  upperPoly.push(p);
                  polygonAppend(upperPoly, poly, lowerIndex, i + 1);
                }
              } else {
                // connect to the closest point within the triangle
                if (lowerIndex > upperIndex) {
                  upperIndex += polygon.length;
                }
                closestDist = Number.MAX_VALUE;
                if (upperIndex < lowerIndex) {
                  return result;
                }
                for (let j = lowerIndex; j <= upperIndex; ++j) {
                  if (
                    isLeftOn(
                      polygonAt(poly, i - 1),
                      polygonAt(poly, i),
                      polygonAt(poly, j),
                    ) &&
                    isRightOn(
                      polygonAt(poly, i + 1),
                      polygonAt(poly, i),
                      polygonAt(poly, j),
                    )
                  ) {
                    d = sqdist(polygonAt(poly, i), polygonAt(poly, j));
                    if (d < closestDist && polygonCanSee2(poly, i, j)) {
                      closestDist = d;
                      closestIndex = j % polygon.length;
                    }
                  }
                }
                if (i < closestIndex) {
                  polygonAppend(lowerPoly, poly, i, closestIndex + 1);
                  if (closestIndex !== 0) {
                    polygonAppend(upperPoly, poly, closestIndex, v.length);
                  }
                  polygonAppend(upperPoly, poly, 0, i + 1);
                } else {
                  if (i !== 0) {
                    polygonAppend(lowerPoly, poly, i, v.length);
                  }
                  polygonAppend(lowerPoly, poly, 0, closestIndex + 1);
                  polygonAppend(upperPoly, poly, closestIndex, i + 1);
                }
              }

              // solve smallest poly first
              if (lowerPoly.length < upperPoly.length) {
                quickDecomp(
                  lowerPoly,
                  result,
                  reflexVertices,
                  steinerPoints,
                  delta,
                  maxlevel,
                  level,
                );
                quickDecomp(
                  upperPoly,
                  result,
                  reflexVertices,
                  steinerPoints,
                  delta,
                  maxlevel,
                  level,
                );
              } else {
                quickDecomp(
                  upperPoly,
                  result,
                  reflexVertices,
                  steinerPoints,
                  delta,
                  maxlevel,
                  level,
                );
                quickDecomp(
                  lowerPoly,
                  result,
                  reflexVertices,
                  steinerPoints,
                  delta,
                  maxlevel,
                  level,
                );
              }
              return result;
            }
          }
          result.push(polygon);
          return result;
        }

        /**
         * Remove collinear points in the polygon.
         * @param thresholdAngle The threshold angle to use when determining whether two edges are collinear. Use zero for finest precision.
         * @return The number of points removed
         */
        function removeCollinearPoints(polygon, thresholdAngle) {
          if (thresholdAngle === void 0) {
            thresholdAngle = 0;
          }
          let num = 0;
          for (let i = polygon.length - 1; polygon.length > 3 && i >= 0; --i) {
            if (
              collinear(
                polygonAt(polygon, i - 1),
                polygonAt(polygon, i),
                polygonAt(polygon, i + 1),
                thresholdAngle,
              )
            ) {
              // Remove the middle point
              polygon.splice(i % polygon.length, 1);
              num++;
            }
          }
          return num;
        }

        /**
         * Check if two scalars are equal
         * @param a scalar a
         * @param b scalar b
         * @param precision the precision for the equality check
         * @return whether the two scalars are equal with the given precision
         */
        function scalarsEqual(a, b, precision) {
          if (precision === void 0) {
            precision = 0;
          }
          precision = precision || 0;
          return Math.abs(a - b) <= precision;
        }

        /**
         * Check if two points are equal
         * @param a point a
         * @param b point b
         * @param precision the precision for the equality check
         * @return if the two points are equal
         */
        function pointsEqual(a, b, precision) {
          if (precision === void 0) {
            precision = 0;
          }
          return (
            scalarsEqual(a[0], b[0], precision) &&
            scalarsEqual(a[1], b[1], precision)
          );
        }

        /**
         * Remove duplicate points in the polygon.
         * @param precision The threshold to use when determining whether two points are the same. Use zero for best precision.
         */
        function removeDuplicatePoints(polygon, precision) {
          if (precision === void 0) {
            precision = 0;
          }
          for (let i = polygon.length - 1; i >= 1; --i) {
            const pi = polygon[i];
            for (let j = i - 1; j >= 0; --j) {
              if (pointsEqual(pi, polygon[j], precision)) {
                polygon.splice(i, 1);
                continue;
              }
            }
          }
        }

        /***/
      },

    /***/ "./node_modules/random-seed/index.js":
      /*!*******************************************!*\
  !*** ./node_modules/random-seed/index.js ***!
  \*******************************************/
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {
        "use strict";
        /*
         * random-seed
         * https://github.com/skratchdot/random-seed
         *
         * This code was originally written by Steve Gibson and can be found here:
         *
         * https://www.grc.com/otg/uheprng.htm
         *
         * It was slightly modified for use in node, to pass jshint, and a few additional
         * helper functions were added.
         *
         * Copyright (c) 2013 skratchdot
         * Dual Licensed under the MIT license and the original GRC copyright/license
         * included below.
         */
        /*	============================================================================
									Gibson Research Corporation
				UHEPRNG - Ultra High Entropy Pseudo-Random Number Generator
	============================================================================
	LICENSE AND COPYRIGHT:  THIS CODE IS HEREBY RELEASED INTO THE PUBLIC DOMAIN
	Gibson Research Corporation releases and disclaims ALL RIGHTS AND TITLE IN
	THIS CODE OR ANY DERIVATIVES. Anyone may be freely use it for any purpose.
	============================================================================
	This is GRC's cryptographically strong PRNG (pseudo-random number generator)
	for JavaScript. It is driven by 1536 bits of entropy, stored in an array of
	48, 32-bit JavaScript variables.  Since many applications of this generator,
	including ours with the "Off The Grid" Latin Square generator, may require
	the deteriministic re-generation of a sequence of PRNs, this PRNG's initial
	entropic state can be read and written as a static whole, and incrementally
	evolved by pouring new source entropy into the generator's internal state.
	----------------------------------------------------------------------------
	ENDLESS THANKS are due Johannes Baagoe for his careful development of highly
	robust JavaScript implementations of JS PRNGs.  This work was based upon his
	JavaScript "Alea" PRNG which is based upon the extremely robust Multiply-
	With-Carry (MWC) PRNG invented by George Marsaglia. MWC Algorithm References:
	http://www.GRC.com/otg/Marsaglia_PRNGs.pdf
	http://www.GRC.com/otg/Marsaglia_MWC_Generators.pdf
	----------------------------------------------------------------------------
	The quality of this algorithm's pseudo-random numbers have been verified by
	multiple independent researchers. It handily passes the fermilab.ch tests as
	well as the "diehard" and "dieharder" test suites.  For individuals wishing
	to further verify the quality of this algorithm's pseudo-random numbers, a
	256-megabyte file of this algorithm's output may be downloaded from GRC.com,
	and a Microsoft Windows scripting host (WSH) version of this algorithm may be
	downloaded and run from the Windows command prompt to generate unique files
	of any size:
	The Fermilab "ENT" tests: http://fourmilab.ch/random/
	The 256-megabyte sample PRN file at GRC: https://www.GRC.com/otg/uheprng.bin
	The Windows scripting host version: https://www.GRC.com/otg/wsh-uheprng.js
	----------------------------------------------------------------------------
	Qualifying MWC multipliers are: 187884, 686118, 898134, 1104375, 1250205,
	1460910 and 1768863. (We use the largest one that's < 2^21)
	============================================================================ */

        var stringify = __webpack_require__(
          /*! json-stringify-safe */ "./node_modules/json-stringify-safe/stringify.js",
        );

        /*	============================================================================
This is based upon Johannes Baagoe's carefully designed and efficient hash
function for use with JavaScript.  It has a proven "avalanche" effect such
that every bit of the input affects every bit of the output 50% of the time,
which is good.	See: http://baagoe.com/en/RandomMusings/hash/avalanche.xhtml
============================================================================
*/
        var Mash = function () {
          var n = 0xefc8249d;
          var mash = function (data) {
            if (data) {
              data = data.toString();
              for (var i = 0; i < data.length; i++) {
                n += data.charCodeAt(i);
                var h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * 0x100000000; // 2^32
              }
              return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
            } else {
              n = 0xefc8249d;
            }
          };
          return mash;
        };

        var uheprng = function (seed) {
          return (function () {
            var o = 48; // set the 'order' number of ENTROPY-holding 32-bit values
            var c = 1; // init the 'carry' used by the multiply-with-carry (MWC) algorithm
            var p = o; // init the 'phase' (max-1) of the intermediate variable pointer
            var s = new Array(o); // declare our intermediate variables array
            var i; // general purpose local
            var j; // general purpose local
            var k = 0; // general purpose local

            // when our "uheprng" is initially invoked our PRNG state is initialized from the
            // browser's own local PRNG. This is okay since although its generator might not
            // be wonderful, it's useful for establishing large startup entropy for our usage.
            var mash = new Mash(); // get a pointer to our high-performance "Mash" hash

            // fill the array with initial mash hash values
            for (i = 0; i < o; i++) {
              s[i] = mash(Math.random());
            }

            // this PRIVATE (internal access only) function is the heart of the multiply-with-carry
            // (MWC) PRNG algorithm. When called it returns a pseudo-random number in the form of a
            // 32-bit JavaScript fraction (0.0 to <1.0) it is a PRIVATE function used by the default
            // [0-1] return function, and by the random 'string(n)' function which returns 'n'
            // characters from 33 to 126.
            var rawprng = function () {
              if (++p >= o) {
                p = 0;
              }
              var t = 1768863 * s[p] + c * 2.3283064365386963e-10; // 2^-32
              return (s[p] = t - (c = t | 0));
            };

            // this EXPORTED function is the default function returned by this library.
            // The values returned are integers in the range from 0 to range-1. We first
            // obtain two 32-bit fractions (from rawprng) to synthesize a single high
            // resolution 53-bit prng (0 to <1), then we multiply this by the caller's
            // "range" param and take the "floor" to return a equally probable integer.
            var random = function (range) {
              return Math.floor(
                range *
                  (rawprng() +
                    ((rawprng() * 0x200000) | 0) * 1.1102230246251565e-16),
              ); // 2^-53
            };

            // this EXPORTED function 'string(n)' returns a pseudo-random string of
            // 'n' printable characters ranging from chr(33) to chr(126) inclusive.
            random.string = function (count) {
              var i;
              var s = "";
              for (i = 0; i < count; i++) {
                s += String.fromCharCode(33 + random(94));
              }
              return s;
            };

            // this PRIVATE "hash" function is used to evolve the generator's internal
            // entropy state. It is also called by the EXPORTED addEntropy() function
            // which is used to pour entropy into the PRNG.
            var hash = function () {
              var args = Array.prototype.slice.call(arguments);
              for (i = 0; i < args.length; i++) {
                for (j = 0; j < o; j++) {
                  s[j] -= mash(args[i]);
                  if (s[j] < 0) {
                    s[j] += 1;
                  }
                }
              }
            };

            // this EXPORTED "clean string" function removes leading and trailing spaces and non-printing
            // control characters, including any embedded carriage-return (CR) and line-feed (LF) characters,
            // from any string it is handed. this is also used by the 'hashstring' function (below) to help
            // users always obtain the same EFFECTIVE uheprng seeding key.
            random.cleanString = function (inStr) {
              inStr = inStr.replace(/(^\s*)|(\s*$)/gi, ""); // remove any/all leading spaces
              inStr = inStr.replace(/[\x00-\x1F]/gi, ""); // remove any/all control characters
              inStr = inStr.replace(/\n /, "\n"); // remove any/all trailing spaces
              return inStr; // return the cleaned up result
            };

            // this EXPORTED "hash string" function hashes the provided character string after first removing
            // any leading or trailing spaces and ignoring any embedded carriage returns (CR) or Line Feeds (LF)
            random.hashString = function (inStr) {
              inStr = random.cleanString(inStr);
              mash(inStr); // use the string to evolve the 'mash' state
              for (i = 0; i < inStr.length; i++) {
                // scan through the characters in our string
                k = inStr.charCodeAt(i); // get the character code at the location
                for (j = 0; j < o; j++) {
                  //	"mash" it into the UHEPRNG state
                  s[j] -= mash(k);
                  if (s[j] < 0) {
                    s[j] += 1;
                  }
                }
              }
            };

            // this EXPORTED function allows you to seed the random generator.
            random.seed = function (seed) {
              if (typeof seed === "undefined" || seed === null) {
                seed = Math.random();
              }
              if (typeof seed !== "string") {
                seed = stringify(seed, function (key, value) {
                  if (typeof value === "function") {
                    return value.toString();
                  }
                  return value;
                });
              }
              random.initState();
              random.hashString(seed);
            };

            // this handy exported function is used to add entropy to our uheprng at any time
            random.addEntropy = function (/* accept zero or more arguments */) {
              var args = [];
              for (i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
              }
              hash(k++ + new Date().getTime() + args.join("") + Math.random());
            };

            // if we want to provide a deterministic startup context for our PRNG,
            // but without directly setting the internal state variables, this allows
            // us to initialize the mash hash and PRNG's internal state before providing
            // some hashing input
            random.initState = function () {
              mash(); // pass a null arg to force mash hash to init
              for (i = 0; i < o; i++) {
                s[i] = mash(" "); // fill the array with initial mash hash values
              }
              c = 1; // init our multiply-with-carry carry
              p = o; // init our phase
            };

            // we use this (optional) exported function to signal the JavaScript interpreter
            // that we're finished using the "Mash" hash function so that it can free up the
            // local "instance variables" is will have been maintaining.  It's not strictly
            // necessary, of course, but it's good JavaScript citizenship.
            random.done = function () {
              mash = null;
            };

            // if we called "uheprng" with a seed value, then execute random.seed() before returning
            if (typeof seed !== "undefined") {
              random.seed(seed);
            }

            // Returns a random integer between 0 (inclusive) and range (exclusive)
            random.range = function (range) {
              return random(range);
            };

            // Returns a random float between 0 (inclusive) and 1 (exclusive)
            random.random = function () {
              return random(Number.MAX_VALUE - 1) / Number.MAX_VALUE;
            };

            // Returns a random float between min (inclusive) and max (exclusive)
            random.floatBetween = function (min, max) {
              return random.random() * (max - min) + min;
            };

            // Returns a random integer between min (inclusive) and max (inclusive)
            random.intBetween = function (min, max) {
              return Math.floor(random.random() * (max - min + 1)) + min;
            };

            // when our main outer "uheprng" function is called, after setting up our
            // initial variables and entropic state, we return an "instance pointer"
            // to the internal anonymous function which can then be used to access
            // the uheprng's various exported functions.  As with the ".done" function
            // above, we should set the returned value to 'null' once we're finished
            // using any of these functions.
            return random;
          })();
        };

        // Modification for use in node:
        uheprng.create = function (seed) {
          return new uheprng(seed);
        };
        module.exports = uheprng;

        /***/
      },

    /***/ "./node_modules/rbush/rbush.min.js":
      /*!*****************************************!*\
  !*** ./node_modules/rbush/rbush.min.js ***!
  \*****************************************/
      /***/ function (module) {
        !(function (t, i) {
          true ? (module.exports = i()) : 0;
        })(this, function () {
          "use strict";
          function t(t, r, e, a, h) {
            !(function t(n, r, e, a, h) {
              for (; a > e; ) {
                if (a - e > 600) {
                  var o = a - e + 1,
                    s = r - e + 1,
                    l = Math.log(o),
                    f = 0.5 * Math.exp((2 * l) / 3),
                    u =
                      0.5 *
                      Math.sqrt((l * f * (o - f)) / o) *
                      (s - o / 2 < 0 ? -1 : 1),
                    m = Math.max(e, Math.floor(r - (s * f) / o + u)),
                    c = Math.min(a, Math.floor(r + ((o - s) * f) / o + u));
                  t(n, r, m, c, h);
                }
                var p = n[r],
                  d = e,
                  x = a;
                for (i(n, e, r), h(n[a], p) > 0 && i(n, e, a); d < x; ) {
                  for (i(n, d, x), d++, x--; h(n[d], p) < 0; ) d++;
                  for (; h(n[x], p) > 0; ) x--;
                }
                0 === h(n[e], p) ? i(n, e, x) : i(n, ++x, a),
                  x <= r && (e = x + 1),
                  r <= x && (a = x - 1);
              }
            })(t, r, e || 0, a || t.length - 1, h || n);
          }
          function i(t, i, n) {
            var r = t[i];
            (t[i] = t[n]), (t[n] = r);
          }
          function n(t, i) {
            return t < i ? -1 : t > i ? 1 : 0;
          }
          var r = function (t) {
            void 0 === t && (t = 9),
              (this._maxEntries = Math.max(4, t)),
              (this._minEntries = Math.max(
                2,
                Math.ceil(0.4 * this._maxEntries),
              )),
              this.clear();
          };
          function e(t, i, n) {
            if (!n) return i.indexOf(t);
            for (var r = 0; r < i.length; r++) if (n(t, i[r])) return r;
            return -1;
          }
          function a(t, i) {
            h(t, 0, t.children.length, i, t);
          }
          function h(t, i, n, r, e) {
            e || (e = p(null)),
              (e.minX = 1 / 0),
              (e.minY = 1 / 0),
              (e.maxX = -1 / 0),
              (e.maxY = -1 / 0);
            for (var a = i; a < n; a++) {
              var h = t.children[a];
              o(e, t.leaf ? r(h) : h);
            }
            return e;
          }
          function o(t, i) {
            return (
              (t.minX = Math.min(t.minX, i.minX)),
              (t.minY = Math.min(t.minY, i.minY)),
              (t.maxX = Math.max(t.maxX, i.maxX)),
              (t.maxY = Math.max(t.maxY, i.maxY)),
              t
            );
          }
          function s(t, i) {
            return t.minX - i.minX;
          }
          function l(t, i) {
            return t.minY - i.minY;
          }
          function f(t) {
            return (t.maxX - t.minX) * (t.maxY - t.minY);
          }
          function u(t) {
            return t.maxX - t.minX + (t.maxY - t.minY);
          }
          function m(t, i) {
            return (
              t.minX <= i.minX &&
              t.minY <= i.minY &&
              i.maxX <= t.maxX &&
              i.maxY <= t.maxY
            );
          }
          function c(t, i) {
            return (
              i.minX <= t.maxX &&
              i.minY <= t.maxY &&
              i.maxX >= t.minX &&
              i.maxY >= t.minY
            );
          }
          function p(t) {
            return {
              children: t,
              height: 1,
              leaf: !0,
              minX: 1 / 0,
              minY: 1 / 0,
              maxX: -1 / 0,
              maxY: -1 / 0,
            };
          }
          function d(i, n, r, e, a) {
            for (var h = [n, r]; h.length; )
              if (!((r = h.pop()) - (n = h.pop()) <= e)) {
                var o = n + Math.ceil((r - n) / e / 2) * e;
                t(i, o, n, r, a), h.push(n, o, o, r);
              }
          }
          return (
            (r.prototype.all = function () {
              return this._all(this.data, []);
            }),
            (r.prototype.search = function (t) {
              var i = this.data,
                n = [];
              if (!c(t, i)) return n;
              for (var r = this.toBBox, e = []; i; ) {
                for (var a = 0; a < i.children.length; a++) {
                  var h = i.children[a],
                    o = i.leaf ? r(h) : h;
                  c(t, o) &&
                    (i.leaf
                      ? n.push(h)
                      : m(t, o)
                        ? this._all(h, n)
                        : e.push(h));
                }
                i = e.pop();
              }
              return n;
            }),
            (r.prototype.collides = function (t) {
              var i = this.data;
              if (!c(t, i)) return !1;
              for (var n = []; i; ) {
                for (var r = 0; r < i.children.length; r++) {
                  var e = i.children[r],
                    a = i.leaf ? this.toBBox(e) : e;
                  if (c(t, a)) {
                    if (i.leaf || m(t, a)) return !0;
                    n.push(e);
                  }
                }
                i = n.pop();
              }
              return !1;
            }),
            (r.prototype.load = function (t) {
              if (!t || !t.length) return this;
              if (t.length < this._minEntries) {
                for (var i = 0; i < t.length; i++) this.insert(t[i]);
                return this;
              }
              var n = this._build(t.slice(), 0, t.length - 1, 0);
              if (this.data.children.length)
                if (this.data.height === n.height)
                  this._splitRoot(this.data, n);
                else {
                  if (this.data.height < n.height) {
                    var r = this.data;
                    (this.data = n), (n = r);
                  }
                  this._insert(n, this.data.height - n.height - 1, !0);
                }
              else this.data = n;
              return this;
            }),
            (r.prototype.insert = function (t) {
              return t && this._insert(t, this.data.height - 1), this;
            }),
            (r.prototype.clear = function () {
              return (this.data = p([])), this;
            }),
            (r.prototype.remove = function (t, i) {
              if (!t) return this;
              for (
                var n, r, a, h = this.data, o = this.toBBox(t), s = [], l = [];
                h || s.length;

              ) {
                if (
                  (h ||
                    ((h = s.pop()),
                    (r = s[s.length - 1]),
                    (n = l.pop()),
                    (a = !0)),
                  h.leaf)
                ) {
                  var f = e(t, h.children, i);
                  if (-1 !== f)
                    return (
                      h.children.splice(f, 1),
                      s.push(h),
                      this._condense(s),
                      this
                    );
                }
                a || h.leaf || !m(h, o)
                  ? r
                    ? (n++, (h = r.children[n]), (a = !1))
                    : (h = null)
                  : (s.push(h),
                    l.push(n),
                    (n = 0),
                    (r = h),
                    (h = h.children[0]));
              }
              return this;
            }),
            (r.prototype.toBBox = function (t) {
              return t;
            }),
            (r.prototype.compareMinX = function (t, i) {
              return t.minX - i.minX;
            }),
            (r.prototype.compareMinY = function (t, i) {
              return t.minY - i.minY;
            }),
            (r.prototype.toJSON = function () {
              return this.data;
            }),
            (r.prototype.fromJSON = function (t) {
              return (this.data = t), this;
            }),
            (r.prototype._all = function (t, i) {
              for (var n = []; t; )
                t.leaf
                  ? i.push.apply(i, t.children)
                  : n.push.apply(n, t.children),
                  (t = n.pop());
              return i;
            }),
            (r.prototype._build = function (t, i, n, r) {
              var e,
                h = n - i + 1,
                o = this._maxEntries;
              if (h <= o) return a((e = p(t.slice(i, n + 1))), this.toBBox), e;
              r ||
                ((r = Math.ceil(Math.log(h) / Math.log(o))),
                (o = Math.ceil(h / Math.pow(o, r - 1)))),
                ((e = p([])).leaf = !1),
                (e.height = r);
              var s = Math.ceil(h / o),
                l = s * Math.ceil(Math.sqrt(o));
              d(t, i, n, l, this.compareMinX);
              for (var f = i; f <= n; f += l) {
                var u = Math.min(f + l - 1, n);
                d(t, f, u, s, this.compareMinY);
                for (var m = f; m <= u; m += s) {
                  var c = Math.min(m + s - 1, u);
                  e.children.push(this._build(t, m, c, r - 1));
                }
              }
              return a(e, this.toBBox), e;
            }),
            (r.prototype._chooseSubtree = function (t, i, n, r) {
              for (; r.push(i), !i.leaf && r.length - 1 !== n; ) {
                for (
                  var e = 1 / 0, a = 1 / 0, h = void 0, o = 0;
                  o < i.children.length;
                  o++
                ) {
                  var s = i.children[o],
                    l = f(s),
                    u =
                      ((m = t),
                      (c = s),
                      (Math.max(c.maxX, m.maxX) - Math.min(c.minX, m.minX)) *
                        (Math.max(c.maxY, m.maxY) - Math.min(c.minY, m.minY)) -
                        l);
                  u < a
                    ? ((a = u), (e = l < e ? l : e), (h = s))
                    : u === a && l < e && ((e = l), (h = s));
                }
                i = h || i.children[0];
              }
              var m, c;
              return i;
            }),
            (r.prototype._insert = function (t, i, n) {
              var r = n ? t : this.toBBox(t),
                e = [],
                a = this._chooseSubtree(r, this.data, i, e);
              for (
                a.children.push(t), o(a, r);
                i >= 0 && e[i].children.length > this._maxEntries;

              )
                this._split(e, i), i--;
              this._adjustParentBBoxes(r, e, i);
            }),
            (r.prototype._split = function (t, i) {
              var n = t[i],
                r = n.children.length,
                e = this._minEntries;
              this._chooseSplitAxis(n, e, r);
              var h = this._chooseSplitIndex(n, e, r),
                o = p(n.children.splice(h, n.children.length - h));
              (o.height = n.height),
                (o.leaf = n.leaf),
                a(n, this.toBBox),
                a(o, this.toBBox),
                i ? t[i - 1].children.push(o) : this._splitRoot(n, o);
            }),
            (r.prototype._splitRoot = function (t, i) {
              (this.data = p([t, i])),
                (this.data.height = t.height + 1),
                (this.data.leaf = !1),
                a(this.data, this.toBBox);
            }),
            (r.prototype._chooseSplitIndex = function (t, i, n) {
              for (
                var r, e, a, o, s, l, u, m = 1 / 0, c = 1 / 0, p = i;
                p <= n - i;
                p++
              ) {
                var d = h(t, 0, p, this.toBBox),
                  x = h(t, p, n, this.toBBox),
                  v =
                    ((e = d),
                    (a = x),
                    (o = void 0),
                    (s = void 0),
                    (l = void 0),
                    (u = void 0),
                    (o = Math.max(e.minX, a.minX)),
                    (s = Math.max(e.minY, a.minY)),
                    (l = Math.min(e.maxX, a.maxX)),
                    (u = Math.min(e.maxY, a.maxY)),
                    Math.max(0, l - o) * Math.max(0, u - s)),
                  M = f(d) + f(x);
                v < m
                  ? ((m = v), (r = p), (c = M < c ? M : c))
                  : v === m && M < c && ((c = M), (r = p));
              }
              return r || n - i;
            }),
            (r.prototype._chooseSplitAxis = function (t, i, n) {
              var r = t.leaf ? this.compareMinX : s,
                e = t.leaf ? this.compareMinY : l;
              this._allDistMargin(t, i, n, r) <
                this._allDistMargin(t, i, n, e) && t.children.sort(r);
            }),
            (r.prototype._allDistMargin = function (t, i, n, r) {
              t.children.sort(r);
              for (
                var e = this.toBBox,
                  a = h(t, 0, i, e),
                  s = h(t, n - i, n, e),
                  l = u(a) + u(s),
                  f = i;
                f < n - i;
                f++
              ) {
                var m = t.children[f];
                o(a, t.leaf ? e(m) : m), (l += u(a));
              }
              for (var c = n - i - 1; c >= i; c--) {
                var p = t.children[c];
                o(s, t.leaf ? e(p) : p), (l += u(s));
              }
              return l;
            }),
            (r.prototype._adjustParentBBoxes = function (t, i, n) {
              for (var r = n; r >= 0; r--) o(i[r], t);
            }),
            (r.prototype._condense = function (t) {
              for (var i = t.length - 1, n = void 0; i >= 0; i--)
                0 === t[i].children.length
                  ? i > 0
                    ? (n = t[i - 1].children).splice(n.indexOf(t[i]), 1)
                    : this.clear()
                  : a(t[i], this.toBBox);
            }),
            r
          );
        });

        /***/
      },

    /***/ "./node_modules/sat/SAT.js":
      /*!*********************************!*\
  !*** ./node_modules/sat/SAT.js ***!
  \*********************************/
      /***/ function (module, exports, __webpack_require__) {
        var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__; // Version 0.9.0 - Copyright 2012 - 2021 -  Jim Riecken <jimr@jimr.ca>
        //
        // Released under the MIT License - https://github.com/jriecken/sat-js
        //
        // A simple library for determining intersections of circles and
        // polygons using the Separating Axis Theorem.
        /** @preserve SAT.js - Version 0.9.0 - Copyright 2012 - 2021 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */

        /*global define: false, module: false*/
        /*jshint shadow:true, sub:true, forin:true, noarg:true, noempty:true,
  eqeqeq:true, bitwise:true, strict:true, undef:true,
  curly:true, browser:true */

        // Create a UMD wrapper for SAT. Works in:
        //
        //  - Plain browser via global SAT variable
        //  - AMD loader (like require.js)
        //  - Node.js
        //
        // The quoted properties all over the place are used so that the Closure Compiler
        // does not mangle the exposed API in advanced mode.
        /**
         * @param {*} root - The global scope
         * @param {Function} factory - Factory that creates SAT module
         */
        (function (root, factory) {
          "use strict";
          if (true) {
            !((__WEBPACK_AMD_DEFINE_FACTORY__ = factory),
            (__WEBPACK_AMD_DEFINE_RESULT__ =
              typeof __WEBPACK_AMD_DEFINE_FACTORY__ === "function"
                ? __WEBPACK_AMD_DEFINE_FACTORY__.call(
                    exports,
                    __webpack_require__,
                    exports,
                    module,
                  )
                : __WEBPACK_AMD_DEFINE_FACTORY__),
            __WEBPACK_AMD_DEFINE_RESULT__ !== undefined &&
              (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
          } else {
          }
        })(this, function () {
          "use strict";

          var SAT = {};

          //
          // ## Vector
          //
          // Represents a vector in two dimensions with `x` and `y` properties.

          // Create a new Vector, optionally passing in the `x` and `y` coordinates. If
          // a coordinate is not specified, it will be set to `0`
          /**
           * @param {?number=} x The x position.
           * @param {?number=} y The y position.
           * @constructor
           */
          function Vector(x, y) {
            this["x"] = x || 0;
            this["y"] = y || 0;
          }
          SAT["Vector"] = Vector;
          // Alias `Vector` as `V`
          SAT["V"] = Vector;

          // Copy the values of another Vector into this one.
          /**
           * @param {Vector} other The other Vector.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["copy"] = Vector.prototype.copy = function (other) {
            this["x"] = other["x"];
            this["y"] = other["y"];
            return this;
          };

          // Create a new vector with the same coordinates as this on.
          /**
           * @return {Vector} The new cloned vector
           */
          Vector.prototype["clone"] = Vector.prototype.clone = function () {
            return new Vector(this["x"], this["y"]);
          };

          // Change this vector to be perpendicular to what it was before. (Effectively
          // roatates it 90 degrees in a clockwise direction)
          /**
           * @return {Vector} This for chaining.
           */
          Vector.prototype["perp"] = Vector.prototype.perp = function () {
            var x = this["x"];
            this["x"] = this["y"];
            this["y"] = -x;
            return this;
          };

          // Rotate this vector (counter-clockwise) by the specified angle (in radians).
          /**
           * @param {number} angle The angle to rotate (in radians)
           * @return {Vector} This for chaining.
           */
          Vector.prototype["rotate"] = Vector.prototype.rotate = function (
            angle,
          ) {
            var x = this["x"];
            var y = this["y"];
            this["x"] = x * Math.cos(angle) - y * Math.sin(angle);
            this["y"] = x * Math.sin(angle) + y * Math.cos(angle);
            return this;
          };

          // Reverse this vector.
          /**
           * @return {Vector} This for chaining.
           */
          Vector.prototype["reverse"] = Vector.prototype.reverse = function () {
            this["x"] = -this["x"];
            this["y"] = -this["y"];
            return this;
          };

          // Normalize this vector.  (make it have length of `1`)
          /**
           * @return {Vector} This for chaining.
           */
          Vector.prototype["normalize"] = Vector.prototype.normalize =
            function () {
              var d = this.len();
              if (d > 0) {
                this["x"] = this["x"] / d;
                this["y"] = this["y"] / d;
              }
              return this;
            };

          // Add another vector to this one.
          /**
           * @param {Vector} other The other Vector.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["add"] = Vector.prototype.add = function (other) {
            this["x"] += other["x"];
            this["y"] += other["y"];
            return this;
          };

          // Subtract another vector from this one.
          /**
           * @param {Vector} other The other Vector.
           * @return {Vector} This for chaiing.
           */
          Vector.prototype["sub"] = Vector.prototype.sub = function (other) {
            this["x"] -= other["x"];
            this["y"] -= other["y"];
            return this;
          };

          // Scale this vector. An independent scaling factor can be provided
          // for each axis, or a single scaling factor that will scale both `x` and `y`.
          /**
           * @param {number} x The scaling factor in the x direction.
           * @param {?number=} y The scaling factor in the y direction.  If this
           *   is not specified, the x scaling factor will be used.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["scale"] = Vector.prototype.scale = function (x, y) {
            this["x"] *= x;
            this["y"] *= typeof y != "undefined" ? y : x;
            return this;
          };

          // Project this vector on to another vector.
          /**
           * @param {Vector} other The vector to project onto.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["project"] = Vector.prototype.project = function (
            other,
          ) {
            var amt = this.dot(other) / other.len2();
            this["x"] = amt * other["x"];
            this["y"] = amt * other["y"];
            return this;
          };

          // Project this vector onto a vector of unit length. This is slightly more efficient
          // than `project` when dealing with unit vectors.
          /**
           * @param {Vector} other The unit vector to project onto.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["projectN"] = Vector.prototype.projectN = function (
            other,
          ) {
            var amt = this.dot(other);
            this["x"] = amt * other["x"];
            this["y"] = amt * other["y"];
            return this;
          };

          // Reflect this vector on an arbitrary axis.
          /**
           * @param {Vector} axis The vector representing the axis.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["reflect"] = Vector.prototype.reflect = function (
            axis,
          ) {
            var x = this["x"];
            var y = this["y"];
            this.project(axis).scale(2);
            this["x"] -= x;
            this["y"] -= y;
            return this;
          };

          // Reflect this vector on an arbitrary axis (represented by a unit vector). This is
          // slightly more efficient than `reflect` when dealing with an axis that is a unit vector.
          /**
           * @param {Vector} axis The unit vector representing the axis.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["reflectN"] = Vector.prototype.reflectN = function (
            axis,
          ) {
            var x = this["x"];
            var y = this["y"];
            this.projectN(axis).scale(2);
            this["x"] -= x;
            this["y"] -= y;
            return this;
          };

          // Get the dot product of this vector and another.
          /**
           * @param {Vector}  other The vector to dot this one against.
           * @return {number} The dot product.
           */
          Vector.prototype["dot"] = Vector.prototype.dot = function (other) {
            return this["x"] * other["x"] + this["y"] * other["y"];
          };

          // Get the squared length of this vector.
          /**
           * @return {number} The length^2 of this vector.
           */
          Vector.prototype["len2"] = Vector.prototype.len2 = function () {
            return this.dot(this);
          };

          // Get the length of this vector.
          /**
           * @return {number} The length of this vector.
           */
          Vector.prototype["len"] = Vector.prototype.len = function () {
            return Math.sqrt(this.len2());
          };

          // ## Circle
          //
          // Represents a circle with a position and a radius.

          // Create a new circle, optionally passing in a position and/or radius. If no position
          // is given, the circle will be at `(0,0)`. If no radius is provided, the circle will
          // have a radius of `0`.
          /**
           * @param {Vector=} pos A vector representing the position of the center of the circle
           * @param {?number=} r The radius of the circle
           * @constructor
           */
          function Circle(pos, r) {
            this["pos"] = pos || new Vector();
            this["r"] = r || 0;
            this["offset"] = new Vector();
          }
          SAT["Circle"] = Circle;

          // Compute the axis-aligned bounding box (AABB) of this Circle.
          //
          // Note: Returns a _new_ `Box` each time you call this.
          /**
           * @return {Polygon} The AABB
           */
          Circle.prototype["getAABBAsBox"] = Circle.prototype.getAABBAsBox =
            function () {
              var r = this["r"];
              var corner = this["pos"]
                .clone()
                .add(this["offset"])
                .sub(new Vector(r, r));
              return new Box(corner, r * 2, r * 2);
            };

          // Compute the axis-aligned bounding box (AABB) of this Circle.
          //
          // Note: Returns a _new_ `Polygon` each time you call this.
          /**
           * @return {Polygon} The AABB
           */
          Circle.prototype["getAABB"] = Circle.prototype.getAABB = function () {
            return this.getAABBAsBox().toPolygon();
          };

          // Set the current offset to apply to the radius.
          /**
           * @param {Vector} offset The new offset vector.
           * @return {Circle} This for chaining.
           */
          Circle.prototype["setOffset"] = Circle.prototype.setOffset =
            function (offset) {
              this["offset"] = offset;
              return this;
            };

          // ## Polygon
          //
          // Represents a *convex* polygon with any number of points (specified in counter-clockwise order)
          //
          // Note: Do _not_ manually change the `points`, `angle`, or `offset` properties. Use the
          // provided setters. Otherwise the calculated properties will not be updated correctly.
          //
          // `pos` can be changed directly.

          // Create a new polygon, passing in a position vector, and an array of points (represented
          // by vectors relative to the position vector). If no position is passed in, the position
          // of the polygon will be `(0,0)`.
          /**
           * @param {Vector=} pos A vector representing the origin of the polygon. (all other
           *   points are relative to this one)
           * @param {Array<Vector>=} points An array of vectors representing the points in the polygon,
           *   in counter-clockwise order.
           * @constructor
           */
          function Polygon(pos, points) {
            this["pos"] = pos || new Vector();
            this["angle"] = 0;
            this["offset"] = new Vector();
            this.setPoints(points || []);
          }
          SAT["Polygon"] = Polygon;

          // Set the points of the polygon. Any consecutive duplicate points will be combined.
          //
          // Note: The points are counter-clockwise *with respect to the coordinate system*.
          // If you directly draw the points on a screen that has the origin at the top-left corner
          // it will _appear_ visually that the points are being specified clockwise. This is just
          // because of the inversion of the Y-axis when being displayed.
          /**
           * @param {Array<Vector>=} points An array of vectors representing the points in the polygon,
           *   in counter-clockwise order.
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype["setPoints"] = Polygon.prototype.setPoints =
            function (points) {
              // Only re-allocate if this is a new polygon or the number of points has changed.
              var lengthChanged =
                !this["points"] || this["points"].length !== points.length;
              if (lengthChanged) {
                var i;
                var calcPoints = (this["calcPoints"] = []);
                var edges = (this["edges"] = []);
                var normals = (this["normals"] = []);
                // Allocate the vector arrays for the calculated properties
                for (i = 0; i < points.length; i++) {
                  // Remove consecutive duplicate points
                  var p1 = points[i];
                  var p2 = i < points.length - 1 ? points[i + 1] : points[0];
                  if (p1 !== p2 && p1.x === p2.x && p1.y === p2.y) {
                    points.splice(i, 1);
                    i -= 1;
                    continue;
                  }
                  calcPoints.push(new Vector());
                  edges.push(new Vector());
                  normals.push(new Vector());
                }
              }
              this["points"] = points;
              this._recalc();
              return this;
            };

          // Set the current rotation angle of the polygon.
          /**
           * @param {number} angle The current rotation angle (in radians).
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype["setAngle"] = Polygon.prototype.setAngle =
            function (angle) {
              this["angle"] = angle;
              this._recalc();
              return this;
            };

          // Set the current offset to apply to the `points` before applying the `angle` rotation.
          /**
           * @param {Vector} offset The new offset vector.
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype["setOffset"] = Polygon.prototype.setOffset =
            function (offset) {
              this["offset"] = offset;
              this._recalc();
              return this;
            };

          // Rotates this polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).
          //
          // Note: This changes the **original** points (so any `angle` will be applied on top of this rotation).
          /**
           * @param {number} angle The angle to rotate (in radians)
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype["rotate"] = Polygon.prototype.rotate = function (
            angle,
          ) {
            var points = this["points"];
            var len = points.length;
            for (var i = 0; i < len; i++) {
              points[i].rotate(angle);
            }
            this._recalc();
            return this;
          };

          // Translates the points of this polygon by a specified amount relative to the origin of *its own coordinate
          // system* (i.e. `pos`).
          //
          // This is most useful to change the "center point" of a polygon. If you just want to move the whole polygon, change
          // the coordinates of `pos`.
          //
          // Note: This changes the **original** points (so any `offset` will be applied on top of this translation)
          /**
           * @param {number} x The horizontal amount to translate.
           * @param {number} y The vertical amount to translate.
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype["translate"] = Polygon.prototype.translate =
            function (x, y) {
              var points = this["points"];
              var len = points.length;
              for (var i = 0; i < len; i++) {
                points[i]["x"] += x;
                points[i]["y"] += y;
              }
              this._recalc();
              return this;
            };

          // Computes the calculated collision polygon. Applies the `angle` and `offset` to the original points then recalculates the
          // edges and normals of the collision polygon.
          /**
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype._recalc = function () {
            // Calculated points - this is what is used for underlying collisions and takes into account
            // the angle/offset set on the polygon.
            var calcPoints = this["calcPoints"];
            // The edges here are the direction of the `n`th edge of the polygon, relative to
            // the `n`th point. If you want to draw a given edge from the edge value, you must
            // first translate to the position of the starting point.
            var edges = this["edges"];
            // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
            // to the position of the `n`th point. If you want to draw an edge normal, you must first
            // translate to the position of the starting point.
            var normals = this["normals"];
            // Copy the original points array and apply the offset/angle
            var points = this["points"];
            var offset = this["offset"];
            var angle = this["angle"];
            var len = points.length;
            var i;
            for (i = 0; i < len; i++) {
              var calcPoint = calcPoints[i].copy(points[i]);
              calcPoint["x"] += offset["x"];
              calcPoint["y"] += offset["y"];
              if (angle !== 0) {
                calcPoint.rotate(angle);
              }
            }
            // Calculate the edges/normals
            for (i = 0; i < len; i++) {
              var p1 = calcPoints[i];
              var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];
              var e = edges[i].copy(p2).sub(p1);
              normals[i].copy(e).perp().normalize();
            }
            return this;
          };

          // Compute the axis-aligned bounding box. Any current state
          // (translations/rotations) will be applied before constructing the AABB.
          //
          // Note: Returns a _new_ `Box` each time you call this.
          /**
           * @return {Polygon} The AABB
           */
          Polygon.prototype["getAABBAsBox"] = Polygon.prototype.getAABBAsBox =
            function () {
              var points = this["calcPoints"];
              var len = points.length;
              var xMin = points[0]["x"];
              var yMin = points[0]["y"];
              var xMax = points[0]["x"];
              var yMax = points[0]["y"];
              for (var i = 1; i < len; i++) {
                var point = points[i];
                if (point["x"] < xMin) {
                  xMin = point["x"];
                } else if (point["x"] > xMax) {
                  xMax = point["x"];
                }
                if (point["y"] < yMin) {
                  yMin = point["y"];
                } else if (point["y"] > yMax) {
                  yMax = point["y"];
                }
              }
              return new Box(
                this["pos"].clone().add(new Vector(xMin, yMin)),
                xMax - xMin,
                yMax - yMin,
              );
            };

          // Compute the axis-aligned bounding box. Any current state
          // (translations/rotations) will be applied before constructing the AABB.
          //
          // Note: Returns a _new_ `Polygon` each time you call this.
          /**
           * @return {Polygon} The AABB
           */
          Polygon.prototype["getAABB"] = Polygon.prototype.getAABB =
            function () {
              return this.getAABBAsBox().toPolygon();
            };

          // Compute the centroid (geometric center) of the polygon. Any current state
          // (translations/rotations) will be applied before computing the centroid.
          //
          // See https://en.wikipedia.org/wiki/Centroid#Centroid_of_a_polygon
          //
          // Note: Returns a _new_ `Vector` each time you call this.
          /**
           * @return {Vector} A Vector that contains the coordinates of the Centroid.
           */
          Polygon.prototype["getCentroid"] = Polygon.prototype.getCentroid =
            function () {
              var points = this["calcPoints"];
              var len = points.length;
              var cx = 0;
              var cy = 0;
              var ar = 0;
              for (var i = 0; i < len; i++) {
                var p1 = points[i];
                var p2 = i === len - 1 ? points[0] : points[i + 1]; // Loop around if last point
                var a = p1["x"] * p2["y"] - p2["x"] * p1["y"];
                cx += (p1["x"] + p2["x"]) * a;
                cy += (p1["y"] + p2["y"]) * a;
                ar += a;
              }
              ar = ar * 3; // we want 1 / 6 the area and we currently have 2*area
              cx = cx / ar;
              cy = cy / ar;
              return new Vector(cx, cy);
            };

          // ## Box
          //
          // Represents an axis-aligned box, with a width and height.

          // Create a new box, with the specified position, width, and height. If no position
          // is given, the position will be `(0,0)`. If no width or height are given, they will
          // be set to `0`.
          /**
           * @param {Vector=} pos A vector representing the bottom-left of the box (i.e. the smallest x and smallest y value).
           * @param {?number=} w The width of the box.
           * @param {?number=} h The height of the box.
           * @constructor
           */
          function Box(pos, w, h) {
            this["pos"] = pos || new Vector();
            this["w"] = w || 0;
            this["h"] = h || 0;
          }
          SAT["Box"] = Box;

          // Returns a polygon whose edges are the same as this box.
          /**
           * @return {Polygon} A new Polygon that represents this box.
           */
          Box.prototype["toPolygon"] = Box.prototype.toPolygon = function () {
            var pos = this["pos"];
            var w = this["w"];
            var h = this["h"];
            return new Polygon(new Vector(pos["x"], pos["y"]), [
              new Vector(),
              new Vector(w, 0),
              new Vector(w, h),
              new Vector(0, h),
            ]);
          };

          // ## Response
          //
          // An object representing the result of an intersection. Contains:
          //  - The two objects participating in the intersection
          //  - The vector representing the minimum change necessary to extract the first object
          //    from the second one (as well as a unit vector in that direction and the magnitude
          //    of the overlap)
          //  - Whether the first object is entirely inside the second, and vice versa.
          /**
           * @constructor
           */
          function Response() {
            this["a"] = null;
            this["b"] = null;
            this["overlapN"] = new Vector();
            this["overlapV"] = new Vector();
            this.clear();
          }
          SAT["Response"] = Response;

          // Set some values of the response back to their defaults.  Call this between tests if
          // you are going to reuse a single Response object for multiple intersection tests (recommented
          // as it will avoid allcating extra memory)
          /**
           * @return {Response} This for chaining
           */
          Response.prototype["clear"] = Response.prototype.clear = function () {
            this["aInB"] = true;
            this["bInA"] = true;
            this["overlap"] = Number.MAX_VALUE;
            return this;
          };

          // ## Object Pools

          // A pool of `Vector` objects that are used in calculations to avoid
          // allocating memory.
          /**
           * @type {Array<Vector>}
           */
          var T_VECTORS = [];
          for (var i = 0; i < 10; i++) {
            T_VECTORS.push(new Vector());
          }

          // A pool of arrays of numbers used in calculations to avoid allocating
          // memory.
          /**
           * @type {Array<Array<number>>}
           */
          var T_ARRAYS = [];
          for (var i = 0; i < 5; i++) {
            T_ARRAYS.push([]);
          }

          // Temporary response used for polygon hit detection.
          /**
           * @type {Response}
           */
          var T_RESPONSE = new Response();

          // Tiny "point" polygon used for polygon hit detection.
          /**
           * @type {Polygon}
           */
          var TEST_POINT = new Box(
            new Vector(),
            0.000001,
            0.000001,
          ).toPolygon();

          // ## Helper Functions

          // Flattens the specified array of points onto a unit vector axis,
          // resulting in a one dimensional range of the minimum and
          // maximum value on that axis.
          /**
           * @param {Array<Vector>} points The points to flatten.
           * @param {Vector} normal The unit vector axis to flatten on.
           * @param {Array<number>} result An array.  After calling this function,
           *   result[0] will be the minimum value,
           *   result[1] will be the maximum value.
           */
          function flattenPointsOn(points, normal, result) {
            var min = Number.MAX_VALUE;
            var max = -Number.MAX_VALUE;
            var len = points.length;
            for (var i = 0; i < len; i++) {
              // The magnitude of the projection of the point onto the normal
              var dot = points[i].dot(normal);
              if (dot < min) {
                min = dot;
              }
              if (dot > max) {
                max = dot;
              }
            }
            result[0] = min;
            result[1] = max;
          }

          // Check whether two convex polygons are separated by the specified
          // axis (must be a unit vector).
          /**
           * @param {Vector} aPos The position of the first polygon.
           * @param {Vector} bPos The position of the second polygon.
           * @param {Array<Vector>} aPoints The points in the first polygon.
           * @param {Array<Vector>} bPoints The points in the second polygon.
           * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
           *   will be projected onto this axis.
           * @param {Response=} response A Response object (optional) which will be populated
           *   if the axis is not a separating axis.
           * @return {boolean} true if it is a separating axis, false otherwise.  If false,
           *   and a response is passed in, information about how much overlap and
           *   the direction of the overlap will be populated.
           */
          function isSeparatingAxis(
            aPos,
            bPos,
            aPoints,
            bPoints,
            axis,
            response,
          ) {
            var rangeA = T_ARRAYS.pop();
            var rangeB = T_ARRAYS.pop();
            // The magnitude of the offset between the two polygons
            var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
            var projectedOffset = offsetV.dot(axis);
            // Project the polygons onto the axis.
            flattenPointsOn(aPoints, axis, rangeA);
            flattenPointsOn(bPoints, axis, rangeB);
            // Move B's range to its position relative to A.
            rangeB[0] += projectedOffset;
            rangeB[1] += projectedOffset;
            // Check if there is a gap. If there is, this is a separating axis and we can stop
            if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
              T_VECTORS.push(offsetV);
              T_ARRAYS.push(rangeA);
              T_ARRAYS.push(rangeB);
              return true;
            }
            // This is not a separating axis. If we're calculating a response, calculate the overlap.
            if (response) {
              var overlap = 0;
              // A starts further left than B
              if (rangeA[0] < rangeB[0]) {
                response["aInB"] = false;
                // A ends before B does. We have to pull A out of B
                if (rangeA[1] < rangeB[1]) {
                  overlap = rangeA[1] - rangeB[0];
                  response["bInA"] = false;
                  // B is fully inside A.  Pick the shortest way out.
                } else {
                  var option1 = rangeA[1] - rangeB[0];
                  var option2 = rangeB[1] - rangeA[0];
                  overlap = option1 < option2 ? option1 : -option2;
                }
                // B starts further left than A
              } else {
                response["bInA"] = false;
                // B ends before A ends. We have to push A out of B
                if (rangeA[1] > rangeB[1]) {
                  overlap = rangeA[0] - rangeB[1];
                  response["aInB"] = false;
                  // A is fully inside B.  Pick the shortest way out.
                } else {
                  var option1 = rangeA[1] - rangeB[0];
                  var option2 = rangeB[1] - rangeA[0];
                  overlap = option1 < option2 ? option1 : -option2;
                }
              }
              // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
              var absOverlap = Math.abs(overlap);
              if (absOverlap < response["overlap"]) {
                response["overlap"] = absOverlap;
                response["overlapN"].copy(axis);
                if (overlap < 0) {
                  response["overlapN"].reverse();
                }
              }
            }
            T_VECTORS.push(offsetV);
            T_ARRAYS.push(rangeA);
            T_ARRAYS.push(rangeB);
            return false;
          }
          SAT["isSeparatingAxis"] = isSeparatingAxis;

          // Calculates which Voronoi region a point is on a line segment.
          // It is assumed that both the line and the point are relative to `(0,0)`
          //
          //            |       (0)      |
          //     (-1)  [S]--------------[E]  (1)
          //            |       (0)      |
          /**
           * @param {Vector} line The line segment.
           * @param {Vector} point The point.
           * @return  {number} LEFT_VORONOI_REGION (-1) if it is the left region,
           *          MIDDLE_VORONOI_REGION (0) if it is the middle region,
           *          RIGHT_VORONOI_REGION (1) if it is the right region.
           */
          function voronoiRegion(line, point) {
            var len2 = line.len2();
            var dp = point.dot(line);
            // If the point is beyond the start of the line, it is in the
            // left voronoi region.
            if (dp < 0) {
              return LEFT_VORONOI_REGION;
            }
            // If the point is beyond the end of the line, it is in the
            // right voronoi region.
            else if (dp > len2) {
              return RIGHT_VORONOI_REGION;
            }
            // Otherwise, it's in the middle one.
            else {
              return MIDDLE_VORONOI_REGION;
            }
          }
          // Constants for Voronoi regions
          /**
           * @const
           */
          var LEFT_VORONOI_REGION = -1;
          /**
           * @const
           */
          var MIDDLE_VORONOI_REGION = 0;
          /**
           * @const
           */
          var RIGHT_VORONOI_REGION = 1;

          // ## Collision Tests

          // Check if a point is inside a circle.
          /**
           * @param {Vector} p The point to test.
           * @param {Circle} c The circle to test.
           * @return {boolean} true if the point is inside the circle, false if it is not.
           */
          function pointInCircle(p, c) {
            var differenceV = T_VECTORS.pop()
              .copy(p)
              .sub(c["pos"])
              .sub(c["offset"]);
            var radiusSq = c["r"] * c["r"];
            var distanceSq = differenceV.len2();
            T_VECTORS.push(differenceV);
            // If the distance between is smaller than the radius then the point is inside the circle.
            return distanceSq <= radiusSq;
          }
          SAT["pointInCircle"] = pointInCircle;

          // Check if a point is inside a convex polygon.
          /**
           * @param {Vector} p The point to test.
           * @param {Polygon} poly The polygon to test.
           * @return {boolean} true if the point is inside the polygon, false if it is not.
           */
          function pointInPolygon(p, poly) {
            TEST_POINT["pos"].copy(p);
            T_RESPONSE.clear();
            var result = testPolygonPolygon(TEST_POINT, poly, T_RESPONSE);
            if (result) {
              result = T_RESPONSE["aInB"];
            }
            return result;
          }
          SAT["pointInPolygon"] = pointInPolygon;

          // Check if two circles collide.
          /**
           * @param {Circle} a The first circle.
           * @param {Circle} b The second circle.
           * @param {Response=} response Response object (optional) that will be populated if
           *   the circles intersect.
           * @return {boolean} true if the circles intersect, false if they don't.
           */
          function testCircleCircle(a, b, response) {
            // Check if the distance between the centers of the two
            // circles is greater than their combined radius.
            var differenceV = T_VECTORS.pop()
              .copy(b["pos"])
              .add(b["offset"])
              .sub(a["pos"])
              .sub(a["offset"]);
            var totalRadius = a["r"] + b["r"];
            var totalRadiusSq = totalRadius * totalRadius;
            var distanceSq = differenceV.len2();
            // If the distance is bigger than the combined radius, they don't intersect.
            if (distanceSq > totalRadiusSq) {
              T_VECTORS.push(differenceV);
              return false;
            }
            // They intersect.  If we're calculating a response, calculate the overlap.
            if (response) {
              var dist = Math.sqrt(distanceSq);
              response["a"] = a;
              response["b"] = b;
              response["overlap"] = totalRadius - dist;
              response["overlapN"].copy(differenceV.normalize());
              response["overlapV"].copy(differenceV).scale(response["overlap"]);
              response["aInB"] = a["r"] <= b["r"] && dist <= b["r"] - a["r"];
              response["bInA"] = b["r"] <= a["r"] && dist <= a["r"] - b["r"];
            }
            T_VECTORS.push(differenceV);
            return true;
          }
          SAT["testCircleCircle"] = testCircleCircle;

          // Check if a polygon and a circle collide.
          /**
           * @param {Polygon} polygon The polygon.
           * @param {Circle} circle The circle.
           * @param {Response=} response Response object (optional) that will be populated if
           *   they interset.
           * @return {boolean} true if they intersect, false if they don't.
           */
          function testPolygonCircle(polygon, circle, response) {
            // Get the position of the circle relative to the polygon.
            var circlePos = T_VECTORS.pop()
              .copy(circle["pos"])
              .add(circle["offset"])
              .sub(polygon["pos"]);
            var radius = circle["r"];
            var radius2 = radius * radius;
            var points = polygon["calcPoints"];
            var len = points.length;
            var edge = T_VECTORS.pop();
            var point = T_VECTORS.pop();

            // For each edge in the polygon:
            for (var i = 0; i < len; i++) {
              var next = i === len - 1 ? 0 : i + 1;
              var prev = i === 0 ? len - 1 : i - 1;
              var overlap = 0;
              var overlapN = null;

              // Get the edge.
              edge.copy(polygon["edges"][i]);
              // Calculate the center of the circle relative to the starting point of the edge.
              point.copy(circlePos).sub(points[i]);

              // If the distance between the center of the circle and the point
              // is bigger than the radius, the polygon is definitely not fully in
              // the circle.
              if (response && point.len2() > radius2) {
                response["aInB"] = false;
              }

              // Calculate which Voronoi region the center of the circle is in.
              var region = voronoiRegion(edge, point);
              // If it's the left region:
              if (region === LEFT_VORONOI_REGION) {
                // We need to make sure we're in the RIGHT_VORONOI_REGION of the previous edge.
                edge.copy(polygon["edges"][prev]);
                // Calculate the center of the circle relative the starting point of the previous edge
                var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
                region = voronoiRegion(edge, point2);
                if (region === RIGHT_VORONOI_REGION) {
                  // It's in the region we want.  Check if the circle intersects the point.
                  var dist = point.len();
                  if (dist > radius) {
                    // No intersection
                    T_VECTORS.push(circlePos);
                    T_VECTORS.push(edge);
                    T_VECTORS.push(point);
                    T_VECTORS.push(point2);
                    return false;
                  } else if (response) {
                    // It intersects, calculate the overlap.
                    response["bInA"] = false;
                    overlapN = point.normalize();
                    overlap = radius - dist;
                  }
                }
                T_VECTORS.push(point2);
                // If it's the right region:
              } else if (region === RIGHT_VORONOI_REGION) {
                // We need to make sure we're in the left region on the next edge
                edge.copy(polygon["edges"][next]);
                // Calculate the center of the circle relative to the starting point of the next edge.
                point.copy(circlePos).sub(points[next]);
                region = voronoiRegion(edge, point);
                if (region === LEFT_VORONOI_REGION) {
                  // It's in the region we want.  Check if the circle intersects the point.
                  var dist = point.len();
                  if (dist > radius) {
                    // No intersection
                    T_VECTORS.push(circlePos);
                    T_VECTORS.push(edge);
                    T_VECTORS.push(point);
                    return false;
                  } else if (response) {
                    // It intersects, calculate the overlap.
                    response["bInA"] = false;
                    overlapN = point.normalize();
                    overlap = radius - dist;
                  }
                }
                // Otherwise, it's the middle region:
              } else {
                // Need to check if the circle is intersecting the edge,
                // Change the edge into its "edge normal".
                var normal = edge.perp().normalize();
                // Find the perpendicular distance between the center of the
                // circle and the edge.
                var dist = point.dot(normal);
                var distAbs = Math.abs(dist);
                // If the circle is on the outside of the edge, there is no intersection.
                if (dist > 0 && distAbs > radius) {
                  // No intersection
                  T_VECTORS.push(circlePos);
                  T_VECTORS.push(normal);
                  T_VECTORS.push(point);
                  return false;
                } else if (response) {
                  // It intersects, calculate the overlap.
                  overlapN = normal;
                  overlap = radius - dist;
                  // If the center of the circle is on the outside of the edge, or part of the
                  // circle is on the outside, the circle is not fully inside the polygon.
                  if (dist >= 0 || overlap < 2 * radius) {
                    response["bInA"] = false;
                  }
                }
              }

              // If this is the smallest overlap we've seen, keep it.
              // (overlapN may be null if the circle was in the wrong Voronoi region).
              if (
                overlapN &&
                response &&
                Math.abs(overlap) < Math.abs(response["overlap"])
              ) {
                response["overlap"] = overlap;
                response["overlapN"].copy(overlapN);
              }
            }

            // Calculate the final overlap vector - based on the smallest overlap.
            if (response) {
              response["a"] = polygon;
              response["b"] = circle;
              response["overlapV"]
                .copy(response["overlapN"])
                .scale(response["overlap"]);
            }
            T_VECTORS.push(circlePos);
            T_VECTORS.push(edge);
            T_VECTORS.push(point);
            return true;
          }
          SAT["testPolygonCircle"] = testPolygonCircle;

          // Check if a circle and a polygon collide.
          //
          // **NOTE:** This is slightly less efficient than polygonCircle as it just
          // runs polygonCircle and reverses everything at the end.
          /**
           * @param {Circle} circle The circle.
           * @param {Polygon} polygon The polygon.
           * @param {Response=} response Response object (optional) that will be populated if
           *   they interset.
           * @return {boolean} true if they intersect, false if they don't.
           */
          function testCirclePolygon(circle, polygon, response) {
            // Test the polygon against the circle.
            var result = testPolygonCircle(polygon, circle, response);
            if (result && response) {
              // Swap A and B in the response.
              var a = response["a"];
              var aInB = response["aInB"];
              response["overlapN"].reverse();
              response["overlapV"].reverse();
              response["a"] = response["b"];
              response["b"] = a;
              response["aInB"] = response["bInA"];
              response["bInA"] = aInB;
            }
            return result;
          }
          SAT["testCirclePolygon"] = testCirclePolygon;

          // Checks whether polygons collide.
          /**
           * @param {Polygon} a The first polygon.
           * @param {Polygon} b The second polygon.
           * @param {Response=} response Response object (optional) that will be populated if
           *   they interset.
           * @return {boolean} true if they intersect, false if they don't.
           */
          function testPolygonPolygon(a, b, response) {
            var aPoints = a["calcPoints"];
            var aLen = aPoints.length;
            var bPoints = b["calcPoints"];
            var bLen = bPoints.length;
            // If any of the edge normals of A is a separating axis, no intersection.
            for (var i = 0; i < aLen; i++) {
              if (
                isSeparatingAxis(
                  a["pos"],
                  b["pos"],
                  aPoints,
                  bPoints,
                  a["normals"][i],
                  response,
                )
              ) {
                return false;
              }
            }
            // If any of the edge normals of B is a separating axis, no intersection.
            for (var i = 0; i < bLen; i++) {
              if (
                isSeparatingAxis(
                  a["pos"],
                  b["pos"],
                  aPoints,
                  bPoints,
                  b["normals"][i],
                  response,
                )
              ) {
                return false;
              }
            }
            // Since none of the edge normals of A or B are a separating axis, there is an intersection
            // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
            // final overlap vector.
            if (response) {
              response["a"] = a;
              response["b"] = b;
              response["overlapV"]
                .copy(response["overlapN"])
                .scale(response["overlap"]);
            }
            return true;
          }
          SAT["testPolygonPolygon"] = testPolygonPolygon;

          return SAT;
        });

        /***/
      },

    /***/ "./src/base-system.ts":
      /*!****************************!*\
  !*** ./src/base-system.ts ***!
  \****************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.BaseSystem = void 0;
        const box_1 = __webpack_require__(
          /*! ./bodies/box */ "./src/bodies/box.ts",
        );
        const circle_1 = __webpack_require__(
          /*! ./bodies/circle */ "./src/bodies/circle.ts",
        );
        const ellipse_1 = __webpack_require__(
          /*! ./bodies/ellipse */ "./src/bodies/ellipse.ts",
        );
        const line_1 = __webpack_require__(
          /*! ./bodies/line */ "./src/bodies/line.ts",
        );
        const point_1 = __webpack_require__(
          /*! ./bodies/point */ "./src/bodies/point.ts",
        );
        const polygon_1 = __webpack_require__(
          /*! ./bodies/polygon */ "./src/bodies/polygon.ts",
        );
        const model_1 = __webpack_require__(/*! ./model */ "./src/model.ts");
        const optimized_1 = __webpack_require__(
          /*! ./optimized */ "./src/optimized.ts",
        );
        const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
        /**
         * very base collision system (create, insert, update, draw, remove)
         */
        class BaseSystem extends model_1.RBush {
          /**
           * create point at position with options and add to system
           */
          createPoint(position, options) {
            const point = new point_1.Point(position, options);
            this.insert(point);
            return point;
          }
          /**
           * create line at position with options and add to system
           */
          createLine(start, end, options) {
            const line = new line_1.Line(start, end, options);
            this.insert(line);
            return line;
          }
          /**
           * create circle at position with options and add to system
           */
          createCircle(position, radius, options) {
            const circle = new circle_1.Circle(position, radius, options);
            this.insert(circle);
            return circle;
          }
          /**
           * create box at position with options and add to system
           */
          createBox(position, width, height, options) {
            const box = new box_1.Box(position, width, height, options);
            this.insert(box);
            return box;
          }
          /**
           * create ellipse at position with options and add to system
           */
          createEllipse(position, radiusX, radiusY = radiusX, step, options) {
            const ellipse = new ellipse_1.Ellipse(
              position,
              radiusX,
              radiusY,
              step,
              options,
            );
            this.insert(ellipse);
            return ellipse;
          }
          /**
           * create polygon at position with options and add to system
           */
          createPolygon(position, points, options) {
            const polygon = new polygon_1.Polygon(position, points, options);
            this.insert(polygon);
            return polygon;
          }
          /**
           * re-insert body into collision tree and update its bbox
           * every body can be part of only one system
           */
          insert(body) {
            body.bbox = body.getAABBAsBBox();
            if (body.system) {
              // allow end if body inserted and not moved
              if (!(0, utils_1.bodyMoved)(body)) {
                return this;
              }
              // old bounding box *needs* to be removed
              body.system.remove(body);
            }
            // only then we update min, max
            body.minX = body.bbox.minX - body.padding;
            body.minY = body.bbox.minY - body.padding;
            body.maxX = body.bbox.maxX + body.padding;
            body.maxY = body.bbox.maxY + body.padding;
            // reinsert bounding box to collision tree
            return super.insert(body);
          }
          /**
           * updates body in collision tree
           */
          updateBody(body) {
            body.updateBody();
          }
          /**
           * update all bodies aabb
           */
          update() {
            (0, optimized_1.forEach)(this.all(), (body) => {
              this.updateBody(body);
            });
          }
          /**
           * draw exact bodies colliders outline
           */
          draw(context) {
            (0, optimized_1.forEach)(this.all(), (body) => {
              body.draw(context);
            });
          }
          /**
           * draw bounding boxes hierarchy outline
           */
          drawBVH(context) {
            const drawChildren = (body) => {
              (0, utils_1.drawBVH)(context, body);
              if (body.children) {
                (0, optimized_1.forEach)(body.children, drawChildren);
              }
            };
            (0, optimized_1.forEach)(this.data.children, drawChildren);
          }
          /**
           * remove body aabb from collision tree
           */
          remove(body, equals) {
            body.system = undefined;
            return super.remove(body, equals);
          }
          /**
           * get object potential colliders
           * @deprecated because it's slower to use than checkOne() or checkAll()
           */
          getPotentials(body) {
            // filter here is required as collides with self
            return (0, optimized_1.filter)(
              this.search(body),
              (candidate) => candidate !== body,
            );
          }
          /**
           * used to find body deep inside data with finder function returning boolean found or not
           */
          traverse(traverseFunction, { children } = this.data) {
            return children === null || children === void 0
              ? void 0
              : children.find((body, index) => {
                  if (!body) {
                    return false;
                  }
                  if (
                    body.typeGroup &&
                    traverseFunction(body, children, index)
                  ) {
                    return true;
                  }
                  // if callback returns true, ends forEach
                  if (body.children) {
                    this.traverse(traverseFunction, body);
                  }
                });
          }
        }
        exports.BaseSystem = BaseSystem;

        /***/
      },

    /***/ "./src/bodies/box.ts":
      /*!***************************!*\
  !*** ./src/bodies/box.ts ***!
  \***************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Box = void 0;
        const model_1 = __webpack_require__(/*! ../model */ "./src/model.ts");
        const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
        const polygon_1 = __webpack_require__(
          /*! ./polygon */ "./src/bodies/polygon.ts",
        );
        /**
         * collider - box
         */
        class Box extends polygon_1.Polygon {
          /**
           * collider - box
           */
          constructor(position, width, height, options) {
            super(position, (0, utils_1.createBox)(width, height), options);
            /**
             * type of body
             */
            this.type = model_1.BodyType.Box;
            /**
             * faster than type
             */
            this.typeGroup = model_1.BodyGroup.Box;
            /**
             * boxes are convex
             */
            this.isConvex = true;
            this._width = width;
            this._height = height;
          }
          /**
           * get box width
           */
          get width() {
            return this._width;
          }
          /**
           * set box width, update points
           */
          set width(width) {
            this._width = width;
            this.afterUpdateSize();
          }
          /**
           * get box height
           */
          get height() {
            return this._height;
          }
          /**
           * set box height, update points
           */
          set height(height) {
            this._height = height;
            this.afterUpdateSize();
          }
          /**
           * after setting width/height update translate
           * see https://github.com/Prozi/detect-collisions/issues/70
           */
          afterUpdateSize() {
            if (this.isCentered) {
              this.retranslate(false);
            }
            this.setPoints((0, utils_1.createBox)(this._width, this._height));
            if (this.isCentered) {
              this.retranslate();
            }
          }
          /**
           * do not attempt to use Polygon.updateIsConvex()
           */
          updateIsConvex() {
            return;
          }
        }
        exports.Box = Box;

        /***/
      },

    /***/ "./src/bodies/circle.ts":
      /*!******************************!*\
  !*** ./src/bodies/circle.ts ***!
  \******************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Circle = void 0;
        const sat_1 = __webpack_require__(
          /*! sat */ "./node_modules/sat/SAT.js",
        );
        const model_1 = __webpack_require__(/*! ../model */ "./src/model.ts");
        const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
        /**
         * collider - circle
         */
        class Circle extends sat_1.Circle {
          /**
           * collider - circle
           */
          constructor(position, radius, options) {
            super((0, utils_1.ensureVectorPoint)(position), radius);
            /**
             * offset copy without angle applied
             */
            this.offsetCopy = { x: 0, y: 0 };
            /**
             * was the polygon modified and needs update in the next checkCollision
             */
            this.dirty = false;
            /*
             * circles are convex
             */
            this.isConvex = true;
            /**
             * circle type
             */
            this.type = model_1.BodyType.Circle;
            /**
             * faster than type
             */
            this.typeGroup = model_1.BodyGroup.Circle;
            /**
             * always centered
             */
            this.isCentered = true;
            (0, utils_1.extendBody)(this, options);
            this.unscaledRadius = radius;
          }
          /**
           * get this.pos.x
           */
          get x() {
            return this.pos.x;
          }
          /**
           * updating this.pos.x by this.x = x updates AABB
           */
          set x(x) {
            this.pos.x = x;
            this.markAsDirty();
          }
          /**
           * get this.pos.y
           */
          get y() {
            return this.pos.y;
          }
          /**
           * updating this.pos.y by this.y = y updates AABB
           */
          set y(y) {
            this.pos.y = y;
            this.markAsDirty();
          }
          /**
           * allow get scale
           */
          get scale() {
            return this.r / this.unscaledRadius;
          }
          /**
           * shorthand for setScale()
           */
          set scale(scale) {
            this.setScale(scale);
          }
          /**
           * scaleX = scale in case of Circles
           */
          get scaleX() {
            return this.scale;
          }
          /**
           * scaleY = scale in case of Circles
           */
          get scaleY() {
            return this.scale;
          }
          /**
           * group for collision filtering
           */
          get group() {
            return this._group;
          }
          set group(group) {
            this._group = (0, model_1.getGroup)(group);
          }
          /**
           * update position
           */
          setPosition(x, y, update = true) {
            this.pos.x = x;
            this.pos.y = y;
            this.markAsDirty(update);
            return this;
          }
          /**
           * update scale
           */
          setScale(scaleX, _scaleY = scaleX, update = true) {
            this.r = this.unscaledRadius * Math.abs(scaleX);
            this.markAsDirty(update);
            return this;
          }
          /**
           * set rotation
           */
          setAngle(angle, update = true) {
            this.angle = angle;
            const { x, y } = this.getOffsetWithAngle();
            this.offset.x = x;
            this.offset.y = y;
            this.markAsDirty(update);
            return this;
          }
          /**
           * set offset from center
           */
          setOffset(offset, update = true) {
            this.offsetCopy.x = offset.x;
            this.offsetCopy.y = offset.y;
            const { x, y } = this.getOffsetWithAngle();
            this.offset.x = x;
            this.offset.y = y;
            this.markAsDirty(update);
            return this;
          }
          /**
           * get body bounding box, without padding
           */
          getAABBAsBBox() {
            const x = this.pos.x + this.offset.x;
            const y = this.pos.y + this.offset.y;
            return {
              minX: x - this.r,
              maxX: x + this.r,
              minY: y - this.r,
              maxY: y + this.r,
            };
          }
          /**
           * Draws collider on a CanvasRenderingContext2D's current path
           */
          draw(context) {
            const x = this.pos.x + this.offset.x;
            const y = this.pos.y + this.offset.y;
            const r = Math.abs(this.r);
            if (this.isTrigger) {
              const max = Math.max(8, this.r);
              for (let i = 0; i < max; i++) {
                const arc = (i / max) * 2 * Math.PI;
                const arcPrev = ((i - 1) / max) * 2 * Math.PI;
                const fromX = x + Math.cos(arcPrev) * this.r;
                const fromY = y + Math.sin(arcPrev) * this.r;
                const toX = x + Math.cos(arc) * this.r;
                const toY = y + Math.sin(arc) * this.r;
                (0, utils_1.dashLineTo)(context, fromX, fromY, toX, toY);
              }
            } else {
              context.moveTo(x + r, y);
              context.arc(x, y, r, 0, Math.PI * 2);
            }
          }
          /**
           * Draws Bounding Box on canvas context
           */
          drawBVH(context) {
            (0, utils_1.drawBVH)(context, this);
          }
          /**
           * inner function for after position change update aabb in system
           */
          updateBody(update = this.dirty) {
            var _a;
            if (update) {
              (_a = this.system) === null || _a === void 0
                ? void 0
                : _a.insert(this);
              this.dirty = false;
            }
          }
          /**
           * update instantly or mark as dirty
           */
          markAsDirty(update = false) {
            if (update) {
              this.updateBody(true);
            } else {
              this.dirty = true;
            }
          }
          /**
           * internal for getting offset with applied angle
           */
          getOffsetWithAngle() {
            if ((!this.offsetCopy.x && !this.offsetCopy.y) || !this.angle) {
              return this.offsetCopy;
            }
            const sin = Math.sin(this.angle);
            const cos = Math.cos(this.angle);
            const x = this.offsetCopy.x * cos - this.offsetCopy.y * sin;
            const y = this.offsetCopy.x * sin + this.offsetCopy.y * cos;
            return { x, y };
          }
        }
        exports.Circle = Circle;

        /***/
      },

    /***/ "./src/bodies/ellipse.ts":
      /*!*******************************!*\
  !*** ./src/bodies/ellipse.ts ***!
  \*******************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Ellipse = void 0;
        const model_1 = __webpack_require__(/*! ../model */ "./src/model.ts");
        const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
        const polygon_1 = __webpack_require__(
          /*! ./polygon */ "./src/bodies/polygon.ts",
        );
        /**
         * collider - ellipse
         */
        class Ellipse extends polygon_1.Polygon {
          /**
           * collider - ellipse
           */
          constructor(
            position,
            radiusX,
            radiusY = radiusX,
            step = (radiusX + radiusY) / Math.PI,
            options,
          ) {
            super(
              position,
              (0, utils_1.createEllipse)(radiusX, radiusY, step),
              options,
            );
            /**
             * ellipse type
             */
            this.type = model_1.BodyType.Ellipse;
            /**
             * faster than type
             */
            this.typeGroup = model_1.BodyGroup.Ellipse;
            /**
             * ellipses are convex
             */
            this.isConvex = true;
            this._radiusX = radiusX;
            this._radiusY = radiusY;
            this._step = step;
          }
          /**
           * flag to set is body centered
           */
          set isCentered(_isCentered) {}
          /**
           * is body centered?
           */
          get isCentered() {
            return true;
          }
          /**
           * get ellipse step number
           */
          get step() {
            return this._step;
          }
          /**
           * set ellipse step number
           */
          set step(step) {
            this._step = step;
            this.setPoints(
              (0, utils_1.createEllipse)(
                this._radiusX,
                this._radiusY,
                this._step,
              ),
            );
          }
          /**
           * get ellipse radiusX
           */
          get radiusX() {
            return this._radiusX;
          }
          /**
           * set ellipse radiusX, update points
           */
          set radiusX(radiusX) {
            this._radiusX = radiusX;
            this.setPoints(
              (0, utils_1.createEllipse)(
                this._radiusX,
                this._radiusY,
                this._step,
              ),
            );
          }
          /**
           * get ellipse radiusY
           */
          get radiusY() {
            return this._radiusY;
          }
          /**
           * set ellipse radiusY, update points
           */
          set radiusY(radiusY) {
            this._radiusY = radiusY;
            this.setPoints(
              (0, utils_1.createEllipse)(
                this._radiusX,
                this._radiusY,
                this._step,
              ),
            );
          }
          /**
           * do not attempt to use Polygon.center()
           */
          center() {
            return;
          }
          /**
           * do not attempt to use Polygon.updateIsConvex()
           */
          updateIsConvex() {
            return;
          }
        }
        exports.Ellipse = Ellipse;

        /***/
      },

    /***/ "./src/bodies/line.ts":
      /*!****************************!*\
  !*** ./src/bodies/line.ts ***!
  \****************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Line = void 0;
        const sat_1 = __webpack_require__(
          /*! sat */ "./node_modules/sat/SAT.js",
        );
        const model_1 = __webpack_require__(/*! ../model */ "./src/model.ts");
        const polygon_1 = __webpack_require__(
          /*! ./polygon */ "./src/bodies/polygon.ts",
        );
        /**
         * collider - line
         */
        class Line extends polygon_1.Polygon {
          /**
           * collider - line from start to end
           */
          constructor(start, end, options) {
            super(
              start,
              [
                { x: 0, y: 0 },
                { x: end.x - start.x, y: end.y - start.y },
              ],
              options,
            );
            /**
             * line type
             */
            this.type = model_1.BodyType.Line;
            /**
             * faster than type
             */
            this.typeGroup = model_1.BodyGroup.Line;
            /**
             * line is convex
             */
            this.isConvex = true;
            if (this.calcPoints.length === 1 || !end) {
              console.error({ start, end });
              throw new Error("No end point for line provided");
            }
          }
          get start() {
            return {
              x: this.x + this.calcPoints[0].x,
              y: this.y + this.calcPoints[0].y,
            };
          }
          set start({ x, y }) {
            this.x = x;
            this.y = y;
          }
          get end() {
            return {
              x: this.x + this.calcPoints[1].x,
              y: this.y + this.calcPoints[1].y,
            };
          }
          set end({ x, y }) {
            this.points[1].x = x - this.start.x;
            this.points[1].y = y - this.start.y;
            this.setPoints(this.points);
          }
          getCentroid() {
            return new sat_1.Vector(
              (this.end.x - this.start.x) / 2,
              (this.end.y - this.start.y) / 2,
            );
          }
          /**
           * do not attempt to use Polygon.updateIsConvex()
           */
          updateIsConvex() {
            return;
          }
        }
        exports.Line = Line;

        /***/
      },

    /***/ "./src/bodies/point.ts":
      /*!*****************************!*\
  !*** ./src/bodies/point.ts ***!
  \*****************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Point = void 0;
        const model_1 = __webpack_require__(/*! ../model */ "./src/model.ts");
        const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
        const box_1 = __webpack_require__(/*! ./box */ "./src/bodies/box.ts");
        /**
         * collider - point (very tiny box)
         */
        class Point extends box_1.Box {
          /**
           * collider - point (very tiny box)
           */
          constructor(position, options) {
            super(
              (0, utils_1.ensureVectorPoint)(position),
              0.001,
              0.001,
              options,
            );
            /**
             * point type
             */
            this.type = model_1.BodyType.Point;
            /**
             * faster than type
             */
            this.typeGroup = model_1.BodyGroup.Point;
          }
        }
        exports.Point = Point;

        /***/
      },

    /***/ "./src/bodies/polygon.ts":
      /*!*******************************!*\
  !*** ./src/bodies/polygon.ts ***!
  \*******************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Polygon = exports.isSimple = void 0;
        const poly_decomp_es_1 = __webpack_require__(
          /*! poly-decomp-es */ "./node_modules/poly-decomp-es/dist/poly-decomp-es.js",
        );
        Object.defineProperty(exports, "isSimple", {
          enumerable: true,
          get: function () {
            return poly_decomp_es_1.isSimple;
          },
        });
        const sat_1 = __webpack_require__(
          /*! sat */ "./node_modules/sat/SAT.js",
        );
        const model_1 = __webpack_require__(/*! ../model */ "./src/model.ts");
        const optimized_1 = __webpack_require__(
          /*! ../optimized */ "./src/optimized.ts",
        );
        const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
        /**
         * collider - polygon
         */
        class Polygon extends sat_1.Polygon {
          /**
           * collider - polygon
           */
          constructor(position, points, options) {
            super(
              (0, utils_1.ensureVectorPoint)(position),
              (0, utils_1.ensurePolygonPoints)(points),
            );
            /**
             * was the polygon modified and needs update in the next checkCollision
             */
            this.dirty = false;
            /**
             * type of body
             */
            this.type = model_1.BodyType.Polygon;
            /**
             * faster than type
             */
            this.typeGroup = model_1.BodyGroup.Polygon;
            /**
             * is body centered
             */
            this.centered = false;
            /**
             * scale Vector of body
             */
            this.scaleVector = { x: 1, y: 1 };
            if (!points.length) {
              throw new Error("No points in polygon");
            }
            (0, utils_1.extendBody)(this, options);
          }
          /**
           * flag to set is polygon centered
           */
          set isCentered(isCentered) {
            if (this.centered === isCentered) {
              return;
            }
            const centroid = this.getCentroidWithoutRotation();
            if (centroid.x || centroid.y) {
              const x = centroid.x * (isCentered ? 1 : -1);
              const y = centroid.y * (isCentered ? 1 : -1);
              this.translate(-x, -y);
            }
            this.centered = isCentered;
          }
          /**
           * is polygon centered?
           */
          get isCentered() {
            return this.centered;
          }
          get x() {
            return this.pos.x;
          }
          /**
           * updating this.pos.x by this.x = x updates AABB
           */
          set x(x) {
            this.pos.x = x;
            this.markAsDirty();
          }
          get y() {
            return this.pos.y;
          }
          /**
           * updating this.pos.y by this.y = y updates AABB
           */
          set y(y) {
            this.pos.y = y;
            this.markAsDirty();
          }
          /**
           * allow exact getting of scale x - use setScale(x, y) to set
           */
          get scaleX() {
            return this.scaleVector.x;
          }
          /**
           * allow exact getting of scale y - use setScale(x, y) to set
           */
          get scaleY() {
            return this.scaleVector.y;
          }
          /**
           * allow approx getting of scale
           */
          get scale() {
            return (this.scaleVector.x + this.scaleVector.y) / 2;
          }
          /**
           * allow easier setting of scale
           */
          set scale(scale) {
            this.setScale(scale);
          }
          /**
           * group for collision filtering
           */
          get group() {
            return this._group;
          }
          set group(group) {
            this._group = (0, model_1.getGroup)(group);
          }
          /**
           * update position
           */
          setPosition(x, y, update = true) {
            this.pos.x = x;
            this.pos.y = y;
            this.markAsDirty(update);
            return this;
          }
          /**
           * update scale
           */
          setScale(x, y = x, update = true) {
            this.scaleVector.x = Math.abs(x);
            this.scaleVector.y = Math.abs(y);
            super.setPoints(
              (0, optimized_1.map)(this.points, (point, index) => {
                point.x = this.pointsBackup[index].x * this.scaleVector.x;
                point.y = this.pointsBackup[index].y * this.scaleVector.y;
                return point;
              }),
            );
            this.markAsDirty(update);
            return this;
          }
          setAngle(angle, update = true) {
            super.setAngle(angle);
            this.markAsDirty(update);
            return this;
          }
          setOffset(offset, update = true) {
            super.setOffset(offset);
            this.markAsDirty(update);
            return this;
          }
          /**
           * get body bounding box, without padding
           */
          getAABBAsBBox() {
            const { pos, w, h } = this.getAABBAsBox();
            return {
              minX: pos.x,
              minY: pos.y,
              maxX: pos.x + w,
              maxY: pos.y + h,
            };
          }
          /**
           * Draws exact collider on canvas context
           */
          draw(context) {
            (0, utils_1.drawPolygon)(context, this, this.isTrigger);
          }
          /**
           * Draws Bounding Box on canvas context
           */
          drawBVH(context) {
            (0, utils_1.drawBVH)(context, this);
          }
          /**
           * get body centroid without applied angle
           */
          getCentroidWithoutRotation() {
            // keep angle copy
            const angle = this.angle;
            if (angle) {
              // reset angle for get centroid
              this.setAngle(0);
              // get centroid
              const centroid = this.getCentroid();
              // revert angle change
              this.setAngle(angle);
              return centroid;
            }
            return this.getCentroid();
          }
          /**
           * sets polygon points to new array of vectors
           */
          setPoints(points) {
            super.setPoints(points);
            this.updateIsConvex();
            this.pointsBackup = (0, utils_1.clonePointsArray)(points);
            return this;
          }
          /**
           * translates polygon points in x, y direction
           */
          translate(x, y) {
            super.translate(x, y);
            this.pointsBackup = (0, utils_1.clonePointsArray)(this.points);
            return this;
          }
          /**
           * rotates polygon points by angle, in radians
           */
          rotate(angle) {
            super.rotate(angle);
            this.pointsBackup = (0, utils_1.clonePointsArray)(this.points);
            return this;
          }
          /**
           * if true, polygon is not an invalid, self-crossing polygon
           */
          isSimple() {
            return (0, poly_decomp_es_1.isSimple)(
              this.calcPoints.map(utils_1.mapVectorToArray),
            );
          }
          /**
           * inner function for after position change update aabb in system and convex inner polygons
           */
          updateBody(update = this.dirty) {
            var _a;
            if (update) {
              this.updateConvexPolygonPositions();
              (_a = this.system) === null || _a === void 0
                ? void 0
                : _a.insert(this);
              this.dirty = false;
            }
          }
          retranslate(isCentered = this.isCentered) {
            const centroid = this.getCentroidWithoutRotation();
            if (centroid.x || centroid.y) {
              const x = centroid.x * (isCentered ? 1 : -1);
              const y = centroid.y * (isCentered ? 1 : -1);
              this.translate(-x, -y);
            }
          }
          /**
           * update instantly or mark as dirty
           */
          markAsDirty(update = false) {
            if (update) {
              this.updateBody(true);
            } else {
              this.dirty = true;
            }
          }
          /**
           * update the position of the decomposed convex polygons (if any), called
           * after the position of the body has changed
           */
          updateConvexPolygonPositions() {
            if (this.isConvex || !this.convexPolygons) {
              return;
            }
            (0, optimized_1.forEach)(this.convexPolygons, (polygon) => {
              polygon.pos.x = this.pos.x;
              polygon.pos.y = this.pos.y;
            });
          }
          /**
           * returns body split into convex polygons, or empty array for convex bodies
           */
          getConvex() {
            if (
              (this.typeGroup &&
                this.typeGroup !== model_1.BodyGroup.Polygon) ||
              this.points.length < 4
            ) {
              return [];
            }
            const points = (0, optimized_1.map)(
              this.calcPoints,
              utils_1.mapVectorToArray,
            );
            return (0, poly_decomp_es_1.quickDecomp)(points);
          }
          /**
           * updates convex polygons cache in body
           */
          updateConvexPolygons(convex = this.getConvex()) {
            if (this.isConvex) {
              return;
            }
            if (!this.convexPolygons) {
              this.convexPolygons = [];
            }
            (0, optimized_1.forEach)(convex, (points, index) => {
              // lazy create
              if (!this.convexPolygons[index]) {
                this.convexPolygons[index] = new sat_1.Polygon();
              }
              this.convexPolygons[index].pos.x = this.pos.x;
              this.convexPolygons[index].pos.y = this.pos.y;
              this.convexPolygons[index].setPoints(
                (0, utils_1.ensurePolygonPoints)(
                  (0, optimized_1.map)(points, utils_1.mapArrayToVector),
                ),
              );
            });
            // trim array length
            this.convexPolygons.length = convex.length;
          }
          /**
           * after points update set is convex
           */
          updateIsConvex() {
            // all other types other than polygon are always convex
            const convex = this.getConvex();
            // everything with empty array or one element array
            this.isConvex = convex.length <= 1;
            this.updateConvexPolygons(convex);
          }
        }
        exports.Polygon = Polygon;

        /***/
      },

    /***/ "./src/intersect.ts":
      /*!**************************!*\
  !*** ./src/intersect.ts ***!
  \**************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.intersectLinePolygon =
          exports.intersectLineLine =
          exports.intersectLineLineFast =
          exports.intersectLineCircle =
          exports.circleOutsidePolygon =
          exports.circleInPolygon =
          exports.circleInCircle =
          exports.pointOnCircle =
          exports.polygonInPolygon =
          exports.pointInPolygon =
          exports.polygonInCircle =
          exports.ensureConvex =
            void 0;
        const sat_1 = __webpack_require__(
          /*! sat */ "./node_modules/sat/SAT.js",
        );
        const model_1 = __webpack_require__(/*! ./model */ "./src/model.ts");
        const optimized_1 = __webpack_require__(
          /*! ./optimized */ "./src/optimized.ts",
        );
        /**
         * replace body with array of related convex polygons
         */
        function ensureConvex(body) {
          if (body.isConvex || body.typeGroup !== model_1.BodyGroup.Polygon) {
            return [body];
          }
          return body.convexPolygons;
        }
        exports.ensureConvex = ensureConvex;
        function polygonInCircle(polygon, circle) {
          return (0, optimized_1.every)(polygon.calcPoints, (p) =>
            (0, sat_1.pointInCircle)(
              { x: p.x + polygon.pos.x, y: p.y + polygon.pos.y },
              circle,
            ),
          );
        }
        exports.polygonInCircle = polygonInCircle;
        function pointInPolygon(point, polygon) {
          return (0, optimized_1.some)(ensureConvex(polygon), (convex) =>
            (0, sat_1.pointInPolygon)(point, convex),
          );
        }
        exports.pointInPolygon = pointInPolygon;
        function polygonInPolygon(polygonA, polygonB) {
          return (0, optimized_1.every)(polygonA.calcPoints, (point) =>
            pointInPolygon(
              { x: point.x + polygonA.pos.x, y: point.y + polygonA.pos.y },
              polygonB,
            ),
          );
        }
        exports.polygonInPolygon = polygonInPolygon;
        /**
         * https://stackoverflow.com/a/68197894/1749528
         */
        function pointOnCircle(point, circle) {
          return (
            (point.x - circle.pos.x) * (point.x - circle.pos.x) +
              (point.y - circle.pos.y) * (point.y - circle.pos.y) ===
            circle.r * circle.r
          );
        }
        exports.pointOnCircle = pointOnCircle;
        /**
         * https://stackoverflow.com/a/68197894/1749528
         */
        function circleInCircle(bodyA, bodyB) {
          const x1 = bodyA.pos.x;
          const y1 = bodyA.pos.y;
          const x2 = bodyB.pos.x;
          const y2 = bodyB.pos.y;
          const r1 = bodyA.r;
          const r2 = bodyB.r;
          const distSq = Math.sqrt(
            (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2),
          );
          return distSq + r2 === r1 || distSq + r2 < r1;
        }
        exports.circleInCircle = circleInCircle;
        /**
         * https://stackoverflow.com/a/68197894/1749528
         */
        function circleInPolygon(circle, polygon) {
          // Circle with radius 0 isn't a circle
          if (circle.r === 0) {
            return false;
          }
          // If the center of the circle is not within the polygon,
          // then the circle may overlap, but it'll never be "contained"
          // so return false
          if (!pointInPolygon(circle.pos, polygon)) {
            return false;
          }
          // Necessary add polygon pos to points
          const points = (0, optimized_1.map)(
            polygon.calcPoints,
            ({ x, y }) => ({
              x: x + polygon.pos.x,
              y: y + polygon.pos.y,
            }),
          );
          // If the center of the circle is within the polygon,
          // the circle is not outside of the polygon completely.
          // so return false.
          if (
            (0, optimized_1.some)(points, (point) =>
              (0, sat_1.pointInCircle)(point, circle),
            )
          ) {
            return false;
          }
          // If any line-segment of the polygon intersects the circle,
          // the circle is not "contained"
          // so return false
          if (
            (0, optimized_1.some)(points, (end, index) => {
              const start = index
                ? points[index - 1]
                : points[points.length - 1];
              return intersectLineCircle({ start, end }, circle).length > 0;
            })
          ) {
            return false;
          }
          return true;
        }
        exports.circleInPolygon = circleInPolygon;
        /**
         * https://stackoverflow.com/a/68197894/1749528
         */
        function circleOutsidePolygon(circle, polygon) {
          // Circle with radius 0 isn't a circle
          if (circle.r === 0) {
            return false;
          }
          // If the center of the circle is within the polygon,
          // the circle is not outside of the polygon completely.
          // so return false.
          if (pointInPolygon(circle.pos, polygon)) {
            return false;
          }
          // Necessary add polygon pos to points
          const points = (0, optimized_1.map)(
            polygon.calcPoints,
            ({ x, y }) => ({
              x: x + polygon.pos.x,
              y: y + polygon.pos.y,
            }),
          );
          // If the center of the circle is within the polygon,
          // the circle is not outside of the polygon completely.
          // so return false.
          if (
            (0, optimized_1.some)(
              points,
              (point) =>
                (0, sat_1.pointInCircle)(point, circle) ||
                pointOnCircle(point, circle),
            )
          ) {
            return false;
          }
          // If any line-segment of the polygon intersects the circle,
          // the circle is not "contained"
          // so return false
          if (
            (0, optimized_1.some)(points, (end, index) => {
              const start = index
                ? points[index - 1]
                : points[points.length - 1];
              return intersectLineCircle({ start, end }, circle).length > 0;
            })
          ) {
            return false;
          }
          return true;
        }
        exports.circleOutsidePolygon = circleOutsidePolygon;
        /**
         * https://stackoverflow.com/a/37225895/1749528
         */
        function intersectLineCircle(line, { pos, r }) {
          const v1 = {
            x: line.end.x - line.start.x,
            y: line.end.y - line.start.y,
          };
          const v2 = { x: line.start.x - pos.x, y: line.start.y - pos.y };
          const b = (v1.x * v2.x + v1.y * v2.y) * -2;
          const c = (v1.x * v1.x + v1.y * v1.y) * 2;
          const d = Math.sqrt(
            b * b - (v2.x * v2.x + v2.y * v2.y - r * r) * c * 2,
          );
          if (isNaN(d)) {
            // no intercept
            return [];
          }
          const u1 = (b - d) / c; // these represent the unit distance of point one and two on the line
          const u2 = (b + d) / c;
          const results = []; // return array
          if (u1 <= 1 && u1 >= 0) {
            // add point if on the line segment
            results.push({
              x: line.start.x + v1.x * u1,
              y: line.start.y + v1.y * u1,
            });
          }
          if (u2 <= 1 && u2 >= 0) {
            // second add point if on the line segment
            results.push({
              x: line.start.x + v1.x * u2,
              y: line.start.y + v1.y * u2,
            });
          }
          return results;
        }
        exports.intersectLineCircle = intersectLineCircle;
        /**
         * helper for intersectLineLineFast
         */
        function isTurn(point1, point2, point3) {
          const A = (point3.x - point1.x) * (point2.y - point1.y);
          const B = (point2.x - point1.x) * (point3.y - point1.y);
          return A > B + Number.EPSILON ? 1 : A + Number.EPSILON < B ? -1 : 0;
        }
        /**
         * faster implementation of intersectLineLine
         * https://stackoverflow.com/a/16725715/1749528
         */
        function intersectLineLineFast(line1, line2) {
          return (
            isTurn(line1.start, line2.start, line2.end) !==
              isTurn(line1.end, line2.start, line2.end) &&
            isTurn(line1.start, line1.end, line2.start) !==
              isTurn(line1.start, line1.end, line2.end)
          );
        }
        exports.intersectLineLineFast = intersectLineLineFast;
        /**
         * returns the point of intersection
         * https://stackoverflow.com/a/24392281/1749528
         */
        function intersectLineLine(line1, line2) {
          const dX = line1.end.x - line1.start.x;
          const dY = line1.end.y - line1.start.y;
          const determinant =
            dX * (line2.end.y - line2.start.y) -
            (line2.end.x - line2.start.x) * dY;
          if (determinant === 0) {
            return null;
          }
          const lambda =
            ((line2.end.y - line2.start.y) * (line2.end.x - line1.start.x) +
              (line2.start.x - line2.end.x) * (line2.end.y - line1.start.y)) /
            determinant;
          const gamma =
            ((line1.start.y - line1.end.y) * (line2.end.x - line1.start.x) +
              dX * (line2.end.y - line1.start.y)) /
            determinant;
          // check if there is an intersection
          if (!(lambda >= 0 && lambda <= 1) || !(gamma >= 0 && gamma <= 1)) {
            return null;
          }
          return {
            x: line1.start.x + lambda * dX,
            y: line1.start.y + lambda * dY,
          };
        }
        exports.intersectLineLine = intersectLineLine;
        function intersectLinePolygon(line, polygon) {
          const results = [];
          (0, optimized_1.forEach)(polygon.calcPoints, (to, index) => {
            const from = index
              ? polygon.calcPoints[index - 1]
              : polygon.calcPoints[polygon.calcPoints.length - 1];
            const side = {
              start: { x: from.x + polygon.pos.x, y: from.y + polygon.pos.y },
              end: { x: to.x + polygon.pos.x, y: to.y + polygon.pos.y },
            };
            const hit = intersectLineLine(line, side);
            if (hit) {
              results.push(hit);
            }
          });
          return results;
        }
        exports.intersectLinePolygon = intersectLinePolygon;

        /***/
      },

    /***/ "./src/model.ts":
      /*!**********************!*\
  !*** ./src/model.ts ***!
  \**********************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";

        var __importDefault =
          (this && this.__importDefault) ||
          function (mod) {
            return mod && mod.__esModule ? mod : { default: mod };
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.BodyGroup =
          exports.getGroup =
          exports.BodyType =
          exports.SATCircle =
          exports.SATPolygon =
          exports.SATVector =
          exports.Response =
          exports.RBush =
          exports.isSimple =
            void 0;
        const rbush_1 = __importDefault(
          __webpack_require__(/*! rbush */ "./node_modules/rbush/rbush.min.js"),
        );
        Object.defineProperty(exports, "RBush", {
          enumerable: true,
          get: function () {
            return rbush_1.default;
          },
        });
        const sat_1 = __webpack_require__(
          /*! sat */ "./node_modules/sat/SAT.js",
        );
        Object.defineProperty(exports, "SATCircle", {
          enumerable: true,
          get: function () {
            return sat_1.Circle;
          },
        });
        Object.defineProperty(exports, "SATPolygon", {
          enumerable: true,
          get: function () {
            return sat_1.Polygon;
          },
        });
        Object.defineProperty(exports, "Response", {
          enumerable: true,
          get: function () {
            return sat_1.Response;
          },
        });
        Object.defineProperty(exports, "SATVector", {
          enumerable: true,
          get: function () {
            return sat_1.Vector;
          },
        });
        var poly_decomp_es_1 = __webpack_require__(
          /*! poly-decomp-es */ "./node_modules/poly-decomp-es/dist/poly-decomp-es.js",
        );
        Object.defineProperty(exports, "isSimple", {
          enumerable: true,
          get: function () {
            return poly_decomp_es_1.isSimple;
          },
        });
        /**
         * types
         */
        var BodyType;
        (function (BodyType) {
          BodyType["Ellipse"] = "Ellipse";
          BodyType["Circle"] = "Circle";
          BodyType["Polygon"] = "Polygon";
          BodyType["Box"] = "Box";
          BodyType["Line"] = "Line";
          BodyType["Point"] = "Point";
        })((BodyType = exports.BodyType || (exports.BodyType = {})));
        /**
         * for groups
         */
        function getGroup(group) {
          return Math.max(0, Math.min(group, 0x7fffffff));
        }
        exports.getGroup = getGroup;
        /**
         * for groups
         */
        var BodyGroup;
        (function (BodyGroup) {
          BodyGroup[(BodyGroup["Ellipse"] = 32)] = "Ellipse";
          BodyGroup[(BodyGroup["Circle"] = 16)] = "Circle";
          BodyGroup[(BodyGroup["Polygon"] = 8)] = "Polygon";
          BodyGroup[(BodyGroup["Box"] = 4)] = "Box";
          BodyGroup[(BodyGroup["Line"] = 2)] = "Line";
          BodyGroup[(BodyGroup["Point"] = 1)] = "Point";
        })((BodyGroup = exports.BodyGroup || (exports.BodyGroup = {})));

        /***/
      },

    /***/ "./src/optimized.ts":
      /*!**************************!*\
  !*** ./src/optimized.ts ***!
  \**************************/
      /***/ (__unused_webpack_module, exports) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.map =
          exports.filter =
          exports.every =
          exports.some =
          exports.forEach =
            void 0;
        /**
         * 40-90% faster than built-in Array.forEach function.
         *
         * basic benchmark: https://jsbench.me/urle772xdn
         */
        const forEach = (array, callback) => {
          for (let i = 0, l = array.length; i < l; i++) {
            callback(array[i], i);
          }
        };
        exports.forEach = forEach;
        /**
         * 20-90% faster than built-in Array.some function.
         *
         * basic benchmark: https://jsbench.me/l0le7bnnsq
         */
        const some = (array, callback) => {
          for (let i = 0, l = array.length; i < l; i++) {
            if (callback(array[i], i)) {
              return true;
            }
          }
          return false;
        };
        exports.some = some;
        /**
         * 20-40% faster than built-in Array.every function.
         *
         * basic benchmark: https://jsbench.me/unle7da29v
         */
        const every = (array, callback) => {
          for (let i = 0, l = array.length; i < l; i++) {
            if (!callback(array[i], i)) {
              return false;
            }
          }
          return true;
        };
        exports.every = every;
        /**
         * 20-60% faster than built-in Array.filter function.
         *
         * basic benchmark: https://jsbench.me/o1le77ev4l
         */
        const filter = (array, callback) => {
          const output = [];
          for (let i = 0, l = array.length; i < l; i++) {
            const item = array[i];
            if (callback(item, i)) {
              output.push(item);
            }
          }
          return output;
        };
        exports.filter = filter;
        /**
         * 20-70% faster than built-in Array.map
         *
         * basic benchmark: https://jsbench.me/oyle77vbpc
         */
        const map = (array, callback) => {
          const l = array.length;
          const output = new Array(l);
          for (let i = 0; i < l; i++) {
            output[i] = callback(array[i], i);
          }
          return output;
        };
        exports.map = map;

        /***/
      },

    /***/ "./src/system.ts":
      /*!***********************!*\
  !*** ./src/system.ts ***!
  \***********************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.System = void 0;
        const base_system_1 = __webpack_require__(
          /*! ./base-system */ "./src/base-system.ts",
        );
        const line_1 = __webpack_require__(
          /*! ./bodies/line */ "./src/bodies/line.ts",
        );
        const intersect_1 = __webpack_require__(
          /*! ./intersect */ "./src/intersect.ts",
        );
        const model_1 = __webpack_require__(/*! ./model */ "./src/model.ts");
        const optimized_1 = __webpack_require__(
          /*! ./optimized */ "./src/optimized.ts",
        );
        const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
        /**
         * collision system
         */
        class System extends base_system_1.BaseSystem {
          constructor() {
            super(...arguments);
            /**
             * the last collision result
             */
            this.response = new model_1.Response();
          }
          /**
           * re-insert body into collision tree and update its bbox
           * every body can be part of only one system
           */
          insert(body) {
            const insertResult = super.insert(body);
            // set system for later body.system.updateBody(body)
            body.system = this;
            return insertResult;
          }
          /**
           * separate (move away) bodies
           */
          separate() {
            (0, optimized_1.forEach)(this.all(), (body) => {
              this.separateBody(body);
            });
          }
          /**
           * separate (move away) 1 body
           */
          separateBody(body) {
            if (body.isStatic || body.isTrigger) {
              return;
            }
            const offsets = { x: 0, y: 0 };
            const addOffsets = ({ overlapV: { x, y } }) => {
              offsets.x += x;
              offsets.y += y;
            };
            this.checkOne(body, addOffsets);
            if (offsets.x || offsets.y) {
              body.setPosition(body.x - offsets.x, body.y - offsets.y);
            }
          }
          /**
           * check one body collisions with callback
           */
          checkOne(
            body,
            callback = utils_1.returnTrue,
            response = this.response,
          ) {
            // no need to check static body collision
            if (body.isStatic) {
              return false;
            }
            const bodies = this.search(body);
            const checkCollision = (candidate) => {
              if (
                candidate !== body &&
                this.checkCollision(body, candidate, response)
              ) {
                return callback(response);
              }
            };
            return (0, optimized_1.some)(bodies, checkCollision);
          }
          /**
           * check all bodies collisions in area with callback
           */
          checkArea(
            area,
            callback = utils_1.returnTrue,
            response = this.response,
          ) {
            const checkOne = (body) => {
              return this.checkOne(body, callback, response);
            };
            return (0, optimized_1.some)(this.search(area), checkOne);
          }
          /**
           * check all bodies collisions with callback
           */
          checkAll(callback = utils_1.returnTrue, response = this.response) {
            const checkOne = (body) => {
              return this.checkOne(body, callback, response);
            };
            return (0, optimized_1.some)(this.all(), checkOne);
          }
          /**
           * check do 2 objects collide
           */
          checkCollision(bodyA, bodyB, response = this.response) {
            const { bbox: bboxA } = bodyA;
            const { bbox: bboxB } = bodyA;
            // assess the bodies real aabb without padding
            if (
              !(0, utils_1.areSameGroup)(bodyA, bodyB) ||
              !bboxA ||
              !bboxB ||
              (0, utils_1.notIntersectAABB)(bboxA, bboxB)
            ) {
              return false;
            }
            const sat = (0, utils_1.getSATTest)(bodyA, bodyB);
            // 99% of cases
            if (bodyA.isConvex && bodyB.isConvex) {
              // always first clear response
              response.clear();
              return sat(bodyA, bodyB, response);
            }
            // more complex (non convex) cases
            const convexBodiesA = (0, intersect_1.ensureConvex)(bodyA);
            const convexBodiesB = (0, intersect_1.ensureConvex)(bodyB);
            let overlapX = 0;
            let overlapY = 0;
            let collided = false;
            (0, optimized_1.forEach)(convexBodiesA, (convexBodyA) => {
              (0, optimized_1.forEach)(convexBodiesB, (convexBodyB) => {
                // always first clear response
                response.clear();
                if (sat(convexBodyA, convexBodyB, response)) {
                  collided = true;
                  overlapX += response.overlapV.x;
                  overlapY += response.overlapV.y;
                }
              });
            });
            if (collided) {
              const vector = new model_1.SATVector(overlapX, overlapY);
              response.a = bodyA;
              response.b = bodyB;
              response.overlapV.x = overlapX;
              response.overlapV.y = overlapY;
              response.overlapN = vector.normalize();
              response.overlap = vector.len();
              response.aInB = (0, utils_1.checkAInB)(bodyA, bodyB);
              response.bInA = (0, utils_1.checkAInB)(bodyB, bodyA);
            }
            return collided;
          }
          /**
           * raycast to get collider of ray from start to end
           */
          raycast(start, end, allow = utils_1.returnTrue) {
            let minDistance = Infinity;
            let result = null;
            if (!this.ray) {
              this.ray = new line_1.Line(start, end, { isTrigger: true });
            } else {
              this.ray.start = start;
              this.ray.end = end;
            }
            this.insert(this.ray);
            this.checkOne(this.ray, ({ b: body }) => {
              if (!allow(body, this.ray)) {
                return false;
              }
              const points =
                body.typeGroup === model_1.BodyGroup.Circle
                  ? (0, intersect_1.intersectLineCircle)(this.ray, body)
                  : (0, intersect_1.intersectLinePolygon)(this.ray, body);
              (0, optimized_1.forEach)(points, (point) => {
                const pointDistance = (0, utils_1.distance)(start, point);
                if (pointDistance < minDistance) {
                  minDistance = pointDistance;
                  result = { point, body };
                }
              });
            });
            this.remove(this.ray);
            return result;
          }
        }
        exports.System = System;

        /***/
      },

    /***/ "./src/utils.ts":
      /*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        exports.bin2dec =
          exports.returnTrue =
          exports.cloneResponse =
          exports.drawBVH =
          exports.drawPolygon =
          exports.dashLineTo =
          exports.getSATTest =
          exports.getBounceDirection =
          exports.mapArrayToVector =
          exports.mapVectorToArray =
          exports.clonePointsArray =
          exports.checkAInB =
          exports.areSameGroup =
          exports.intersectAABB =
          exports.notIntersectAABB =
          exports.bodyMoved =
          exports.extendBody =
          exports.clockwise =
          exports.distance =
          exports.ensurePolygonPoints =
          exports.ensureVectorPoint =
          exports.createBox =
          exports.createEllipse =
          exports.rad2deg =
          exports.deg2rad =
          exports.RAD2DEG =
          exports.DEG2RAD =
            void 0;
        const sat_1 = __webpack_require__(
          /*! sat */ "./node_modules/sat/SAT.js",
        );
        const intersect_1 = __webpack_require__(
          /*! ./intersect */ "./src/intersect.ts",
        );
        const model_1 = __webpack_require__(/*! ./model */ "./src/model.ts");
        const optimized_1 = __webpack_require__(
          /*! ./optimized */ "./src/optimized.ts",
        );
        /* helpers for faster getSATTest() and checkAInB() */
        const testMap = {
          satCircleCircle: sat_1.testCircleCircle,
          satCirclePolygon: sat_1.testCirclePolygon,
          satPolygonCircle: sat_1.testPolygonCircle,
          satPolygonPolygon: sat_1.testPolygonPolygon,
          inCircleCircle: intersect_1.circleInCircle,
          inCirclePolygon: intersect_1.circleInPolygon,
          inPolygonCircle: intersect_1.polygonInCircle,
          inPolygonPolygon: intersect_1.polygonInPolygon,
        };
        function createMap(bodyType, testType) {
          return Object.values(model_1.BodyType).reduce(
            (result, type) =>
              Object.assign(Object.assign({}, result), {
                [type]:
                  type === model_1.BodyType.Circle
                    ? testMap[`${testType}${bodyType}Circle`]
                    : testMap[`${testType}${bodyType}Polygon`],
              }),
            {},
          );
        }
        const circleSATFunctions = createMap(model_1.BodyType.Circle, "sat");
        const circleInFunctions = createMap(model_1.BodyType.Circle, "in");
        const polygonSATFunctions = createMap(model_1.BodyType.Polygon, "sat");
        const polygonInFunctions = createMap(model_1.BodyType.Polygon, "in");
        exports.DEG2RAD = Math.PI / 180;
        exports.RAD2DEG = 180 / Math.PI;
        /**
         * convert from degrees to radians
         */
        function deg2rad(degrees) {
          return degrees * exports.DEG2RAD;
        }
        exports.deg2rad = deg2rad;
        /**
         * convert from radians to degrees
         */
        function rad2deg(radians) {
          return radians * exports.RAD2DEG;
        }
        exports.rad2deg = rad2deg;
        /**
         * creates ellipse-shaped polygon based on params
         */
        function createEllipse(radiusX, radiusY = radiusX, step = 1) {
          const steps = Math.PI * Math.hypot(radiusX, radiusY) * 2;
          const length = Math.max(8, Math.ceil(steps / Math.max(1, step)));
          const ellipse = [];
          for (let index = 0; index < length; index++) {
            const value = (index / length) * 2 * Math.PI;
            const x = Math.cos(value) * radiusX;
            const y = Math.sin(value) * radiusY;
            ellipse.push(new sat_1.Vector(x, y));
          }
          return ellipse;
        }
        exports.createEllipse = createEllipse;
        /**
         * creates box shaped polygon points
         */
        function createBox(width, height) {
          return [
            new sat_1.Vector(0, 0),
            new sat_1.Vector(width, 0),
            new sat_1.Vector(width, height),
            new sat_1.Vector(0, height),
          ];
        }
        exports.createBox = createBox;
        /**
         * ensure SATVector type point result
         */
        function ensureVectorPoint(point = {}) {
          return point instanceof sat_1.Vector
            ? point
            : new sat_1.Vector(point.x || 0, point.y || 0);
        }
        exports.ensureVectorPoint = ensureVectorPoint;
        /**
         * ensure Vector points (for polygon) in counter-clockwise order
         */
        function ensurePolygonPoints(points = []) {
          const polygonPoints = (0, optimized_1.map)(points, ensureVectorPoint);
          return clockwise(polygonPoints)
            ? polygonPoints.reverse()
            : polygonPoints;
        }
        exports.ensurePolygonPoints = ensurePolygonPoints;
        /**
         * get distance between two Vector points
         */
        function distance(bodyA, bodyB) {
          const xDiff = bodyA.x - bodyB.x;
          const yDiff = bodyA.y - bodyB.y;
          return Math.hypot(xDiff, yDiff);
        }
        exports.distance = distance;
        /**
         * check [is clockwise] direction of polygon
         */
        function clockwise(points) {
          const length = points.length;
          let sum = 0;
          (0, optimized_1.forEach)(points, (v1, index) => {
            const v2 = points[(index + 1) % length];
            sum += (v2.x - v1.x) * (v2.y + v1.y);
          });
          return sum > 0;
        }
        exports.clockwise = clockwise;
        /**
         * used for all types of bodies in constructor
         */
        function extendBody(body, options = {}) {
          body.isStatic = !!options.isStatic;
          body.isTrigger = !!options.isTrigger;
          body.padding = options.padding || 0;
          body.group =
            typeof options.group === "number" ? options.group : 0x7fffffff;
          if (body.typeGroup !== model_1.BodyGroup.Circle) {
            body.isCentered = options.isCentered || false;
          }
          body.setAngle(options.angle || 0);
        }
        exports.extendBody = extendBody;
        /**
         * check if body moved outside of its padding
         */
        function bodyMoved(body) {
          const { bbox, minX, minY, maxX, maxY } = body;
          return (
            bbox.minX < minX ||
            bbox.minY < minY ||
            bbox.maxX > maxX ||
            bbox.maxY > maxY
          );
        }
        exports.bodyMoved = bodyMoved;
        /**
         * returns true if two boxes not intersect
         */
        function notIntersectAABB(bodyA, bodyB) {
          return (
            bodyB.minX > bodyA.maxX ||
            bodyB.minY > bodyA.maxY ||
            bodyB.maxX < bodyA.minX ||
            bodyB.maxY < bodyA.minY
          );
        }
        exports.notIntersectAABB = notIntersectAABB;
        /**
         * checks if two boxes intersect
         */
        function intersectAABB(bodyA, bodyB) {
          return !notIntersectAABB(bodyA, bodyB);
        }
        exports.intersectAABB = intersectAABB;
        /**
         * checks if two bodies can interact (for collision filtering)
         */
        function areSameGroup(bodyA, bodyB) {
          return (
            ((bodyA.group >> 16) & (bodyB.group & 0xffff) &&
              (bodyB.group >> 16) & (bodyA.group & 0xffff)) !== 0
          );
        }
        exports.areSameGroup = areSameGroup;
        /**
         * checks if body a is in body b
         */
        function checkAInB(bodyA, bodyB) {
          const check =
            bodyA.typeGroup === model_1.BodyGroup.Circle
              ? circleInFunctions
              : polygonInFunctions;
          return check[bodyB.type](bodyA, bodyB);
        }
        exports.checkAInB = checkAInB;
        /**
         * clone sat vector points array into vector points array
         */
        function clonePointsArray(points) {
          return (0, optimized_1.map)(points, ({ x, y }) => ({ x, y }));
        }
        exports.clonePointsArray = clonePointsArray;
        /**
         * change format from SAT.js to poly-decomp
         */
        function mapVectorToArray({ x, y } = { x: 0, y: 0 }) {
          return [x, y];
        }
        exports.mapVectorToArray = mapVectorToArray;
        /**
         * change format from poly-decomp to SAT.js
         */
        function mapArrayToVector([x, y] = [0, 0]) {
          return { x, y };
        }
        exports.mapArrayToVector = mapArrayToVector;
        /**
         * given 2 bodies calculate vector of bounce assuming equal mass and they are circles
         */
        function getBounceDirection(body, collider) {
          const v2 = new sat_1.Vector(collider.x - body.x, collider.y - body.y);
          const v1 = new sat_1.Vector(body.x - collider.x, body.y - collider.y);
          const len = v1.dot(v2.normalize()) * 2;
          return new sat_1.Vector(
            v2.x * len - v1.x,
            v2.y * len - v1.y,
          ).normalize();
        }
        exports.getBounceDirection = getBounceDirection;
        /**
         * returns correct sat.js testing function based on body types
         */
        function getSATTest(bodyA, bodyB) {
          const check =
            bodyA.typeGroup === model_1.BodyGroup.Circle
              ? circleSATFunctions
              : polygonSATFunctions;
          return check[bodyB.type];
        }
        exports.getSATTest = getSATTest;
        /**
         * draws dashed line on canvas context
         */
        function dashLineTo(
          context,
          fromX,
          fromY,
          toX,
          toY,
          dash = 2,
          gap = 4,
        ) {
          const xDiff = toX - fromX;
          const yDiff = toY - fromY;
          const arc = Math.atan2(yDiff, xDiff);
          const offsetX = Math.cos(arc);
          const offsetY = Math.sin(arc);
          let posX = fromX;
          let posY = fromY;
          let dist = Math.hypot(xDiff, yDiff);
          while (dist > 0) {
            const step = Math.min(dist, dash);
            context.moveTo(posX, posY);
            context.lineTo(posX + offsetX * step, posY + offsetY * step);
            posX += offsetX * (dash + gap);
            posY += offsetY * (dash + gap);
            dist -= dash + gap;
          }
        }
        exports.dashLineTo = dashLineTo;
        /**
         * draw polygon
         */
        function drawPolygon(context, { pos, calcPoints }, isTrigger = false) {
          const lastPoint = calcPoints[calcPoints.length - 1];
          const fromX = pos.x + lastPoint.x;
          const fromY = pos.y + lastPoint.y;
          if (calcPoints.length === 1) {
            context.arc(fromX, fromY, 1, 0, Math.PI * 2);
          } else {
            context.moveTo(fromX, fromY);
          }
          (0, optimized_1.forEach)(calcPoints, (point, index) => {
            const toX = pos.x + point.x;
            const toY = pos.y + point.y;
            if (isTrigger) {
              const prev = calcPoints[index - 1] || lastPoint;
              dashLineTo(context, pos.x + prev.x, pos.y + prev.y, toX, toY);
            } else {
              context.lineTo(toX, toY);
            }
          });
        }
        exports.drawPolygon = drawPolygon;
        /**
         * draw body bounding body box
         */
        function drawBVH(context, body) {
          drawPolygon(context, {
            pos: { x: body.minX, y: body.minY },
            calcPoints: createBox(body.maxX - body.minX, body.maxY - body.minY),
          });
        }
        exports.drawBVH = drawBVH;
        /**
         * clone response object returning new response with previous ones values
         */
        function cloneResponse(response) {
          const clone = new sat_1.Response();
          const { a, b, overlap, overlapN, overlapV, aInB, bInA } = response;
          clone.a = a;
          clone.b = b;
          clone.overlap = overlap;
          clone.overlapN = overlapN.clone();
          clone.overlapV = overlapV.clone();
          clone.aInB = aInB;
          clone.bInA = bInA;
          return clone;
        }
        exports.cloneResponse = cloneResponse;
        /**
         * dummy fn used as default, for optimization
         */
        function returnTrue() {
          return true;
        }
        exports.returnTrue = returnTrue;
        /**
         * binary string to decimal number
         */
        function bin2dec(binary) {
          return Number(`0b${binary}`.replace(/\s/g, ""));
        }
        exports.bin2dec = bin2dec;

        /***/
      },

    /***/ "./src/demo/canvas.js":
      /*!****************************!*\
  !*** ./src/demo/canvas.js ***!
  \****************************/
      /***/ (module) => {
        const width = window.innerWidth || 1024;
        const height = window.innerHeight || 768;

        class TestCanvas {
          constructor(test) {
            this.test = test;

            this.element = document.createElement("div");
            this.element.id = "debug";
            this.element.innerHTML = `${this.test.legend}
    <div>
      <label>
        <input id="bvh" type="checkbox"/> Show Bounding Volume Hierarchy
      </label>
    </div>`;

            this.canvas = document.createElement("canvas");
            this.canvas.width = width;
            this.canvas.height = height;

            this.context = this.canvas.getContext("2d");
            this.context.font = "24px Arial";
            this.test.context = this.context;

            this.bvhCheckbox = this.element.querySelector("#bvh");

            if (this.canvas instanceof Node) {
              this.element.appendChild(this.canvas);
            }

            this.fps = 0;
            this.frame = 0;
            this.started = Date.now();

            loop(this.update.bind(this));
          }

          update() {
            this.frame++;

            const timeDiff = Date.now() - this.started;
            if (timeDiff >= 1000) {
              this.fps = this.frame / (timeDiff / 1000);
              this.frame = 0;
              this.started = Date.now();
            }

            // Clear the canvas
            this.context.fillStyle = "#000000";
            this.context.fillRect(0, 0, width, height);

            // Render the bodies
            this.context.strokeStyle = "#FFFFFF";
            this.context.beginPath();
            this.test.physics.draw(this.context);
            this.context.stroke();

            // Render the BVH
            if (this.bvhCheckbox.checked) {
              this.context.strokeStyle = "#00FF00";
              this.context.beginPath();
              this.test.physics.drawBVH(this.context);
              this.context.stroke();
            }

            // Render the FPS
            this.context.fillStyle = "#FFCC00";
            this.context.fillText(
              `FPS: ${this.fps ? this.fps.toFixed(0) : "?"}`,
              24,
              48,
            );

            if (this.test.drawCallback) {
              this.test.drawCallback();
            }
          }
        }

        function loop(callback) {
          // interval for fps instead of setTimeout
          // and ms = 1 which is lowest nonzero value
          // for responsiveness of user input
          setInterval(callback, 1);
        }

        module.exports.TestCanvas = TestCanvas;

        module.exports.loop = loop;

        module.exports.width = width;

        module.exports.height = height;

        /***/
      },

    /***/ "./src/demo/stress.js":
      /*!****************************!*\
  !*** ./src/demo/stress.js ***!
  \****************************/
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {
        const { BodyGroup } = __webpack_require__(
          /*! ../model */ "./src/model.ts",
        );
        const { System } = __webpack_require__(
          /*! ../system */ "./src/system.ts",
        );
        const { getBounceDirection } = __webpack_require__(
          /*! ../utils */ "./src/utils.ts",
        );
        const { width, height, loop } = __webpack_require__(
          /*! ./canvas */ "./src/demo/canvas.js",
        );
        const seededRandom = __webpack_require__(
          /*! random-seed */ "./node_modules/random-seed/index.js",
        ).create("@Prozi").random;

        function random(min, max) {
          return Math.floor(seededRandom() * max) + min;
        }

        class Stress {
          constructor(count = 2000) {
            this.size = Math.sqrt((width * height) / (count * 50));

            this.physics = new System(5);
            this.bodies = [];
            this.polygons = 0;
            this.boxes = 0;
            this.circles = 0;
            this.ellipses = 0;
            this.lines = 0;
            this.lastVariant = 0;
            this.count = count;
            this.bounds = this.getBounds();
            this.enableFiltering = false;

            for (let i = 0; i < count; ++i) {
              this.createShape(!random(0, 20));
            }

            this.legend = `<div><b>Total:</b> ${count}</div>
    <div><b>Polygons:</b> ${this.polygons}</div>
    <div><b>Boxes:</b> ${this.boxes}</div>
    <div><b>Circles:</b> ${this.circles}</div>
    <div><b>Ellipses:</b> ${this.ellipses}</div>
    <div><b>Lines:</b> ${this.lines}</div>
    <div>
      <label>
        <input id="filtering" type="checkbox"/> Enable Collision Filtering
      </label>
    </div>
    `;

            this.lastTime = Date.now();
            this.updateBody = this.updateBody.bind(this);

            // observer #debug & add filtering checkbox event
            const observer = new window.MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                  if (node.id == "debug") {
                    document
                      .querySelector("#filtering")
                      .addEventListener("change", () => this.toggleFiltering());
                    observer.disconnect();
                  }
                });
              });
            });
            observer.observe(document.querySelector("body"), {
              subtree: false,
              childList: true,
            });

            this.start = () => {
              loop(this.update.bind(this));
            };
          }

          getBounds() {
            return [
              this.physics.createBox({ x: 0, y: 0 }, width, 10, {
                isStatic: true,
              }),
              this.physics.createBox({ x: width - 10, y: 0 }, 10, height, {
                isStatic: true,
              }),
              this.physics.createBox({ x: 0, y: height - 10 }, width, 10, {
                isStatic: true,
              }),
              this.physics.createBox({ x: 0, y: 0 }, 10, height, {
                isStatic: true,
              }),
            ];
          }

          toggleFiltering() {
            this.enableFiltering = !this.enableFiltering;
            this.physics.clear();
            this.bodies.length = 0;
            this.polygons = 0;
            this.boxes = 0;
            this.circles = 0;
            this.ellipses = 0;
            this.lines = 0;
            this.lastVariant = 0;
            this.bounds = this.getBounds();
            for (let i = 0; i < this.count; ++i) {
              this.createShape(!random(0, 20));
            }
          }

          update() {
            const now = Date.now();
            this.timeScale = Math.min(1000, now - this.lastTime) / 60;
            this.lastTime = now;
            this.bodies.forEach(this.updateBody);
          }

          updateBody(body) {
            body.setAngle(
              body.angle + body.rotationSpeed * this.timeScale,
              false,
            );

            if (seededRandom() < 0.05 * this.timeScale) {
              body.targetScale.x = 0.5 + seededRandom();
            }

            if (seededRandom() < 0.05 * this.timeScale) {
              body.targetScale.y = 0.5 + seededRandom();
            }

            if (Math.abs(body.targetScale.x - body.scaleX) > 0.01) {
              const scaleX =
                body.scaleX +
                Math.sign(body.targetScale.x - body.scaleX) *
                  0.02 *
                  this.timeScale;
              const scaleY =
                body.scaleY +
                Math.sign(body.targetScale.y - body.scaleY) *
                  0.02 *
                  this.timeScale;

              body.setScale(scaleX, scaleY, false);
            }

            // as last step update position, and bounding box
            body.setPosition(
              body.x + body.directionX * this.timeScale,
              body.y + body.directionY * this.timeScale,
            );

            // separate + bounce
            this.bounceBody(body);
          }

          bounceBody(body) {
            const bounces = { x: 0, y: 0 };
            const addBounces = ({ overlapV: { x, y } }) => {
              bounces.x += x;
              bounces.y += y;
            };

            this.physics.checkOne(body, addBounces);

            if (bounces.x || bounces.y) {
              const size = 0.5 * (body.scaleX + body.scaleY);
              const bounce = getBounceDirection(body, {
                x: body.x + bounces.x,
                y: body.y + bounces.y,
              });

              bounce.scale(body.size).add({
                x: body.directionX * size,
                y: body.directionY * size,
              });

              const { x, y } = bounce.normalize();

              body.directionX = x;
              body.directionY = y;
              body.rotationSpeed = (seededRandom() - seededRandom()) * 0.1;

              body.setPosition(body.x - bounces.x, body.y - bounces.y);
            }
          }

          createShape(large) {
            const minSize = this.size * 1.0 * (large ? seededRandom() + 1 : 1);
            const maxSize =
              this.size * 1.25 * (large ? seededRandom() * 2 + 1 : 1);
            const x = random(0, width);
            const y = random(0, height);
            const direction = (random(0, 360) * Math.PI) / 180;
            const options = {
              isCentered: true,
              padding: (minSize + maxSize) * 0.2,
            };

            let body;
            let variant = this.lastVariant++ % 5;

            switch (variant) {
              case 0:
                if (this.enableFiltering) {
                  options.group = (BodyGroup.Circle << 16) | BodyGroup.Circle;
                }
                body = this.physics.createCircle(
                  { x, y },
                  random(minSize, maxSize) / 2,
                  options,
                );

                ++this.circles;
                break;

              case 1:
                const width = random(minSize, maxSize);
                const height = random(minSize, maxSize);
                if (this.enableFiltering) {
                  options.group = (BodyGroup.Ellipse << 16) | BodyGroup.Ellipse;
                  console.log();
                }
                body = this.physics.createEllipse(
                  { x, y },
                  width,
                  height,
                  2,
                  options,
                );

                ++this.ellipses;
                break;

              case 2:
                if (this.enableFiltering) {
                  options.group = (BodyGroup.Box << 16) | BodyGroup.Box;
                }
                body = this.physics.createBox(
                  { x, y },
                  random(minSize, maxSize),
                  random(minSize, maxSize),
                  options,
                );

                ++this.boxes;
                break;

              case 3:
                if (this.enableFiltering) {
                  options.group = (BodyGroup.Line << 16) | BodyGroup.Line;
                }
                body = this.physics.createLine(
                  { x, y },
                  {
                    x: x + random(minSize, maxSize),
                    y: y + random(minSize, maxSize),
                  },
                  options,
                );

                ++this.lines;
                break;

              default:
                if (this.enableFiltering) {
                  options.group = (BodyGroup.Polygon << 16) | BodyGroup.Polygon;
                }
                body = this.physics.createPolygon(
                  { x, y },
                  [
                    {
                      x: -random(minSize, maxSize),
                      y: random(minSize, maxSize),
                    },
                    {
                      x: random(minSize, maxSize),
                      y: random(minSize, maxSize),
                    },
                    {
                      x: random(minSize, maxSize),
                      y: -random(minSize, maxSize),
                    },
                    {
                      x: -random(minSize, maxSize),
                      y: -random(minSize, maxSize),
                    },
                  ],
                  options,
                );

                ++this.polygons;
                break;
            }

            // set initial rotation angle direction
            body.rotationSpeed = (seededRandom() - seededRandom()) * 0.1;
            body.setAngle((random(0, 360) * Math.PI) / 180);

            body.targetScale = { x: 1, y: 1 };
            body.size = (minSize + maxSize) / 2;

            body.directionX = Math.cos(direction);
            body.directionY = Math.sin(direction);

            this.bodies.push(body);
          }
        }

        module.exports = Stress;

        /***/
      },

    /***/ "./src/demo/tank.js":
      /*!**************************!*\
  !*** ./src/demo/tank.js ***!
  \**************************/
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {
        const { BodyGroup } = __webpack_require__(
          /*! ../model */ "./src/model.ts",
        );
        const { System } = __webpack_require__(
          /*! ../system */ "./src/system.ts",
        );
        const { mapVectorToArray } = __webpack_require__(
          /*! ../utils */ "./src/utils.ts",
        );
        const { width, height, loop } = __webpack_require__(
          /*! ./canvas */ "./src/demo/canvas.js",
        );

        class Tank {
          constructor() {
            this.physics = new System();
            this.bodies = [];
            this.player = this.createPlayer(400, 300);

            this.createPolygon(
              300,
              300,
              [
                { x: -11.25, y: -6.76 },
                { x: -12.5, y: -6.76 },
                { x: -12.5, y: 6.75 },
                { x: -3.1, y: 6.75 },
                { x: -3.1, y: 0.41 },
                { x: -2.35, y: 0.41 },
                { x: -2.35, y: 6.75 },
                { x: 0.77, y: 6.75 },
                { x: 0.77, y: 7.5 },
                { x: -13.25, y: 7.5 },
                { x: -13.25, y: -7.51 },
                { x: -11.25, y: -7.51 },
              ]
                .map(mapVectorToArray)
                .map(([x, y]) => [x * 10, y * 10]),
            );

            this.up = false;
            this.down = false;
            this.left = false;
            this.right = false;

            this.legend = `<div><b>W, S</b> - Accelerate/Decelerate</div>
    <div><b>A, D</b> - Turn</div>`;

            const updateKeys = ({ type, key }) => {
              const keyDown = type === "keydown";
              const keyLowerCase = key.toLowerCase();

              keyLowerCase === "w" && (this.up = keyDown);
              keyLowerCase === "s" && (this.down = keyDown);
              keyLowerCase === "a" && (this.left = keyDown);
              keyLowerCase === "d" && (this.right = keyDown);
            };

            document.addEventListener("keydown", updateKeys);
            document.addEventListener("keyup", updateKeys);

            if (this.canvas instanceof Node) {
              this.element.appendChild(this.canvas);
            }

            this.createMap();
            this.lastTime = Date.now();

            this.start = () => {
              loop(this.update.bind(this));
            };
          }

          update() {
            const now = Date.now();
            this.timeScale = Math.min(1000, now - this.lastTime) / 60;
            this.lastTime = now;
            this.handleInput();
            this.processGameLogic();
            this.handleCollisions();
            this.updateTurret();
          }

          handleInput() {
            if (this.up) {
              this.player.velocity += 0.2 * this.timeScale;
            }

            if (this.down) {
              this.player.velocity -= 0.2 * this.timeScale;
            }

            if (this.left) {
              this.player.setAngle(this.player.angle - 0.2 * this.timeScale);
            }

            if (this.right) {
              this.player.setAngle(this.player.angle + 0.2 * this.timeScale);
            }
          }

          processGameLogic() {
            const x = Math.cos(this.player.angle);
            const y = Math.sin(this.player.angle);

            if (this.player.velocity > 0) {
              this.player.velocity = Math.max(
                this.player.velocity - 0.1 * this.timeScale,
                0,
              );

              if (this.player.velocity > 2) {
                this.player.velocity = 2;
              }
            } else if (this.player.velocity < 0) {
              this.player.velocity = Math.min(
                this.player.velocity + 0.1 * this.timeScale,
                0,
              );

              if (this.player.velocity < -2) {
                this.player.velocity = -2;
              }
            }

            if (!Math.round(this.player.velocity * 100)) {
              this.player.velocity = 0;
            }

            if (this.player.velocity) {
              this.player.setPosition(
                this.player.x + x * this.player.velocity,
                this.player.y + y * this.player.velocity,
              );
            }
          }

          handleCollisions() {
            this.physics.checkAll(({ a, b, overlapV }) => {
              if (a.isTrigger || b.isTrigger) {
                return;
              }

              if (a.typeGroup === BodyGroup.Polygon || a === this.player) {
                a.setPosition(a.pos.x - overlapV.x, a.pos.y - overlapV.y);
              }

              if (b.typeGroup === BodyGroup.Circle || b === this.player) {
                b.setPosition(b.pos.x + overlapV.x, b.pos.y + overlapV.y);
              }

              if (a === this.player) {
                a.velocity *= 0.9;
              }
            });
          }

          updateTurret() {
            this.playerTurret.setAngle(this.player.angle, false);
            this.playerTurret.setPosition(this.player.x, this.player.y);

            const hit = this.physics.raycast(
              this.playerTurret.start,
              this.playerTurret.end,
              (test) => test !== this.player,
            );

            this.drawCallback = () => {
              if (hit) {
                this.context.strokeStyle = "#FF0000";
                this.context.beginPath();
                this.context.arc(hit.point.x, hit.point.y, 5, 0, 2 * Math.PI);
                this.context.stroke();
              }
            };
          }

          createPlayer(x, y, size = 13) {
            const player =
              Math.random() < 0.5
                ? this.physics.createCircle(
                    { x: this.scaleX(x), y: this.scaleY(y) },
                    this.scaleX(size / 2),
                    { isCentered: true },
                  )
                : this.physics.createBox(
                    {
                      x: this.scaleX(x - size / 2),
                      y: this.scaleY(y - size / 2),
                    },
                    this.scaleX(size),
                    this.scaleX(size),
                    { isCentered: true },
                  );

            player.velocity = 0;
            player.setOffset({ x: -this.scaleX(size / 2), y: 0 });
            player.setAngle(0.2);

            this.physics.updateBody(player);
            this.playerTurret = this.physics.createLine(
              player,
              { x: player.x + this.scaleX(20) + this.scaleY(20), y: player.y },
              { angle: 0.2, isTrigger: true },
            );

            return player;
          }

          scaleX(x) {
            return (x / 800) * width;
          }

          scaleY(y) {
            return (y / 600) * height;
          }

          createCircle(x, y, radius) {
            this.physics.createCircle(
              { x: this.scaleX(x), y: this.scaleY(y) },
              this.scaleX(radius),
            );
          }

          createEllipse(x, y, radiusX, radiusY, step, angle) {
            this.physics.createEllipse(
              { x: this.scaleX(x), y: this.scaleY(y) },
              this.scaleX(radiusX),
              this.scaleY(radiusY),
              step,
              { angle },
            );
          }

          createPolygon(x, y, points, angle) {
            const scaledPoints = points.map(([pointX, pointY]) => ({
              x: this.scaleX(pointX),
              y: this.scaleY(pointY),
            }));

            return this.physics.createPolygon(
              { x: this.scaleX(x), y: this.scaleY(y) },
              scaledPoints,
              { angle },
            );
          }

          createMap(width = 800, height = 600) {
            // World bounds
            // World bounds
            this.createPolygon(0, 0, [
              [0, 0],
              [width, 0],
            ]);
            this.createPolygon(0, 0, [
              [width, 0],
              [width, height],
            ]);
            this.createPolygon(0, 0, [
              [width, height],
              [0, height],
            ]);
            this.createPolygon(0, 0, [
              [0, height],
              [0, 0],
            ]);

            // Factory
            this.createPolygon(
              100,
              100,
              [
                [-50, -50],
                [50, -50],
                [50, 50],
                [-50, 50],
              ],
              0.4,
            );
            this.createPolygon(
              190,
              105,
              [
                [-20, -20],
                [20, -20],
                [20, 20],
                [-20, 20],
              ],
              0.4,
            );
            this.createCircle(170, 140, 6);
            this.createCircle(185, 155, 6);
            this.createCircle(165, 165, 6);
            this.createCircle(145, 165, 6);

            // Airstrip
            this.createPolygon(
              230,
              50,
              [
                [-150, -30],
                [150, -30],
                [150, 30],
                [-150, 30],
              ],
              0.4,
            );

            // HQ
            this.createPolygon(
              100,
              500,
              [
                [-40, -50],
                [40, -50],
                [50, 50],
                [-50, 50],
              ],
              0.2,
            );
            this.createCircle(180, 490, 12);
            this.createCircle(175, 540, 12);

            // Barracks
            this.createPolygon(
              400,
              500,
              [
                [-60, -20],
                [60, -20],
                [60, 20],
                [-60, 20],
              ],
              1.7,
            );
            this.createPolygon(
              350,
              494,
              [
                [-60, -20],
                [60, -20],
                [60, 20],
                [-60, 20],
              ],
              1.7,
            );

            // Mountains
            this.createPolygon(750, 0, [
              [0, 0],
              [-20, 100],
            ]);
            this.createPolygon(750, 0, [
              [-20, 100],
              [30, 250],
            ]);
            this.createPolygon(750, 0, [
              [30, 250],
              [20, 300],
            ]);
            this.createPolygon(750, 0, [
              [20, 300],
              [-50, 320],
            ]);
            this.createPolygon(750, 0, [
              [-50, 320],
              [-90, 500],
            ]);
            this.createPolygon(750, 0, [
              [-90, 500],
              [-200, 600],
            ]);

            // Lake
            this.createEllipse(530, 130, 80, 70, 10, -0.2);
          }
        }

        module.exports = Tank;

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__,
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/define property getters */
  /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    /*!***************************!*\
  !*** ./src/demo/index.js ***!
  \***************************/
    const { TestCanvas } = __webpack_require__(
      /*! ./canvas */ "./src/demo/canvas.js",
    );

    const isStressTest = window.location.search.indexOf("?stress") !== -1;
    const Test = isStressTest
      ? __webpack_require__(/*! ./stress */ "./src/demo/stress.js")
      : __webpack_require__(/*! ./tank */ "./src/demo/tank.js");

    const test = new Test();
    const canvas = new TestCanvas(test);

    document.body.appendChild(canvas.element);

    if (test.start) {
      test.start();
    }
  })();

  /******/
})();
