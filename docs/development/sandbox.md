# Run extension in sandbox mode

Start the extension for local development. It will be started in a sandboxed environment with no other extensions active and the extension will not persist when you stop the debugger.

Follow these steps:

1. Open VS Code at this repo if you haven't already.
2. Go to the _Debug_ tab.
3. Run the extension
    - Click _Run Extension_ task.
        - This will start in a default directory such as the home directory.
        - You might want to use File / Open to change the sandbox window to a repo what has more content to play with. This will be remembered on later runs. Unfortunately if you changed your VS Code settings to open in a new window on Open, then the extension setup will be undone.
    - Or click the _Run in Sandbox repo_ task
        - For more reliable and consistent behavior.
        - This will run against `sandbox` directory in the project, which is a git repo where you can make files and commits as you like. You'll need to run `npm run sb` first to ensure this exists and then run the debug action. Run the command again clear the space and start over.
        - Note that the extension currently doesn't work on a repo with zero commits, so you'll have to make a commit and then use the extension.

That will start a new sandboxed VS Code session which has the extension active and all others inactive. At a lower level, it runs `npm compile` and `npm watch`.

The code for the extension is in [src](/src/).


## Reload

The `watch` task is supposed to be running in the background but I haven't actually seen it actually pick up changes and effect what I see in the debugging window.

So if you make a change to your source code, in the original repo you muyst use the green _Restart_ circle in the debugger to reload the extension in the sandbox window.

If you don't see code changes appearing, you may need to stop and start the debugger afresh.
