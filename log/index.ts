export function log(...messages: any[]): void {
  console.log(`[LOG]: ${messages.join(" ")}`);
}