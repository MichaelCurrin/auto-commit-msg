/**
 * CLI utilities shared by bin commands.
 */

/**
 * Determine whether help should be displayed.
 *
 * @param argv Command-line arguments passed to the CLI.
 * @returns True when `--help` or `-h` is present in the arguments.
 */
export function shouldShowHelp(argv: string[]): boolean {
  return argv.includes("--help") || argv.includes("-h");
}
