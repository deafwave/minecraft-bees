const [mon1, mon2] = peripheral.find<MonitorPeripheral>("monitor", (name: string, object: any) => object.isColour());

if (mon1) {
  mon1.setTextColour(colours.blue);
  mon1.write("Hello");
}
if (mon2) {
  mon2.setTextColour(colours.red);
  mon2.write("World");
}