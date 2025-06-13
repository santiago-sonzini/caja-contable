interface LatLng {
    lat: number;
    lng: number;
  }
  
  interface ViaWaypoint {
    location: LatLng;
    step_index: number;
    step_interpolation: number;
  }
  
  interface Route {
    bounds: {
      Jk: any;
      Jh: any;
    };
    copyrights: string;
    legs: RouteLeg[];
    overview_path: LatLng[];
    overview_polyline: {
      points: string;
    };
    summary: string;
    warnings: any[];
    waypoint_order: any[];
    via_waypoints: LatLng[];
  }
  
  interface RouteLeg {
    distance: {
      text: string;
      value: number; // in meters
    };
    duration: {
      text: string;
      value: number; // in seconds
    };
    end_address: string;
    end_location: LatLng;
    start_address: string;
    start_location: LatLng;
    steps: RouteStep[];
    traffic_speed_entry: any[];
    via_waypoint: ViaWaypoint[];
  }
  
  interface RouteStep {
    distance: {
      text: string;
      value: number; // in meters
    };
    duration: {
      text: string;
      value: number; // in seconds
    };
    end_location: LatLng;
    start_location: LatLng;
    html_instructions?: string;
    polyline?: {
      points: string;
    };
    travel_mode: string;
    maneuver?: string;
  }
  
  /**
   * Calculates the estimated time to reach each waypoint in a route leg
   * @param leg The route leg containing waypoints
   * @param steps Array of route steps
   * @returns An array of objects with waypoint index and time to reach (in seconds)
   */
  function calculateWaypointTimes(leg: any): { waypointIndex: number; timeToReach: number; stepIndex: number }[] {
    // If there are no waypoints, return empty array
    if (!leg.via_waypoint || leg.via_waypoint.length === 0) {
      return [];
    }
    
    return leg.via_waypoint.map((waypoint: any, index: number) => {
      //console.log("🚀 ~ returnleg.via_waypoints.map ~ waypoint:", waypoint)
      // Get the step that contains this waypoint
      const step = leg.steps[waypoint.step_index];
      //console.log("🚀 ~ returnleg.via_waypoints.map ~ step:", step)
      
      // Calculate accumulated time up to the step containing this waypoint
      let accumulatedTime = 0;
      for (let i = 0; i < waypoint.step_index; i++) {
        accumulatedTime += leg.steps[i]?.duration?.value ?? 0;
      }
      
      // Add the time within the step (based on step interpolation)
      const timeWithinStep = step?.duration ? step.duration.value * waypoint.step_interpolation : 0;
      const totalTimeToReach = accumulatedTime + timeWithinStep;
      
      return {
        waypointIndex: index,
        stepIndex: waypoint.step_index,
        timeToReach: Math.round(totalTimeToReach * 100) / 100 // Round to 2 decimal places
      };
    });
  }
  
  /**
   * Calculates the estimated time to reach each waypoint in a full route
   * @param route The complete route object
   * @returns An array of objects with leg index, waypoint index, and time (in seconds)
   */
 export function calculateFullRouteWaypointTimes(route: google.maps.DirectionsRoute): { 
    legIndex: number;
    waypointIndex: number; 
    stepIndex: number;
    timeToReach: number;
    formattedTime: string;
    location: LatLng;
  }[] {
    const result: { 
      legIndex: number;
      waypointIndex: number;
      stepIndex: number;
      timeToReach: number;
      formattedTime: string;
      location: LatLng;
    }[] = [];
    
    route.legs.forEach((leg: any, legIndex) => {
      console.log("🚀 ~ route.legs.forEach ~ leg:", leg)
      if (leg.via_waypoint && leg.via_waypoint.length > 0) {
        const legWaypointTimes = calculateWaypointTimes(leg);
        console.log("🚀 ~ route.legs.forEach ~ legWaypointTimes:", legWaypointTimes)
        
        legWaypointTimes.forEach((waypointTime, waypointIndex) => {
          const waypoint: any = leg.via_waypoints[waypointIndex];
          
          result.push({
            legIndex,
            waypointIndex,
            stepIndex: waypoint?.step_index ?? 0,
            timeToReach: waypointTime.timeToReach,
            formattedTime: formatTime(waypointTime.timeToReach),
            location: waypoint?.location ?? { lat: 0, lng: 0 }
          });
        });
      }
    });
    
    return result;
  }
  
  /**
   * Formats seconds into a human-readable time string
   * @param seconds Time in seconds
   * @returns Formatted time string (e.g., "1h 23m 45s")
   */
  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.round(seconds % 60);
    
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) result += `${remainingSeconds}s`;
    
    return result.trim();
  }
  
  // Example usage based on the screenshot data
  const example: Route = {
    bounds: {
      Jk: { i: "ida" },
      Jh: "Kk"
    },
    copyrights: "Powered by Google, ©2025 Google",
    legs: [
      {
        distance: { text: '16,5 km', value: 16455 },
        duration: { text: '38 min', value: 2264 },
        end_address: "Avellaneda 2345, X5900 Villa María, Córdoba, Argentina",
        end_location: { lat: 0, lng: 0 },
        start_address: "Avellaneda 2345, X5900 Villa María, Córdoba, Argentina",
        start_location: { lat: 0, lng: 0 },
        steps: Array(26).fill({
          distance: { text: '', value: 0 },
          duration: { text: '', value: 0 },
          end_location: { lat: 0, lng: 0 },
          start_location: { lat: 0, lng: 0 },
          travel_mode: "DRIVING"
        }),
        traffic_speed_entry: [],
        via_waypoint: [
          {
            location: { lat: 0, lng: 0 },
            step_index: 8,
            step_interpolation: 0.03560757004667054
          },
          {
            location: { lat: 0, lng: 0 },
            step_index: 19,
            step_interpolation: 0.619115453767914
          }
        ]
      }
    ],
    overview_path: Array(160).fill({ lat: 0, lng: 0 }),
    overview_polyline: {
      points: "f~vdEhe}`Khq@AQLkadA|BdEtFbK~GdMLl~SyMbLwB~ACAIAQBKLClFvJFt"
    },
    summary: "RN158",
    warnings: [],
    waypoint_order: [],
    via_waypoints: Array(2).fill({ lat: 0, lng: 0 })
  };
  
  // Calculate times for waypoints in a single ste