
  // Handle zone click to zoom to the zone
  const handleZoneClick = React.useCallback((zoneId: string) => {
    const zone = mapData.zones.find(z => z.id === zoneId);
    if (zone && Viewer.current) {
      // Calculate zone bounds in global coordinates
      const { minX, minY, maxX, maxY } = calculateZoneBounds(zone);
      const globalMinX = minX + zone.position_x;
      const globalMinY = minY + zone.position_y;
      const globalMaxX = maxX + zone.position_x;
      const globalMaxY = maxY + zone.position_y;

      // Calculate center of the zone
      const centerX = (globalMinX + globalMaxX) / 2;
      const centerY = (globalMinY + globalMaxY) / 2;

      // Calculate appropriate zoom level to fit the zone
      const zoneWidth = globalMaxX - globalMinX;
      const zoneHeight = globalMaxY - globalMinY;
      const viewerWidth = dimensions.width;
      const viewerHeight = dimensions.height;

      // Calculate zoom level to make the zone fill the entire screen
      const scaleX = viewerWidth / zoneWidth;
      const scaleY = viewerHeight / zoneHeight;
      // Use the smaller scale to ensure the entire zone fits in the viewport
      const newZoomLevel = Math.min(scaleX, scaleY) * 0.95; // Slightly smaller to ensure edges are visible

      Viewer.current.setPointOnViewerCenter(centerX, centerY, newZoomLevel);

      // Update the zoom level state to trigger rectangle opacity change
      setZoomLevel(newZoomLevel);

      // Set full map view as inactive since we're zooming into a zone
      setIsFullMapView(false);
    }
  }, [mapData, dimensions]);
