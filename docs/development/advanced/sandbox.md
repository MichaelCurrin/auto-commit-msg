# Run extension in sandbox mode

Start the extension for local development.

This allows manual integration tests. Here we set up a separate sandboxed VS Code instance in an new window. That window has all extensions **disable** except the extension we are working on. And your original VS Code instance will not be affected.

If you prefer not use this approach, you can just compile and install the extension globally. It will override the existing extension though.


## Start sandbox

Follow these steps:

1. Open VS Code at this repo if you haven't already.
2. Go to the _Debug_ tab.
3. Select one of two tasks:
    - _Run Extension_ task.
        - This will start in a default directory such as your user's home directory.
        - You might want to use File / Open to change the sandbox window to a repo what has more content to play with. This will be remembered on later runs. Unfortunately if you changed your VS Code settings to open in a new window on Open, then the extension setup will be undone.
    - Start in Sandbox repo_ task.
        - For more reliable and consistent behavior.
        - This will run against `sandbox` directory in the project, which is a git repo where you can make files and commits as you like. Y
        - NB. You'll need to run `npm run sb` first to ensure this directory exists and then run the debug action. Run that NPM command again to clear the space and start over.
4. Click the play arrow.

That will start a new sandboxed VS Code session which has the extension active and all others inactive. At a lower level, it runs `npm compile` and `npm watch`.

The code for the extension is in [src](/src/).


## Reload

The `watch` task is supposed to be running in the background but I haven't actually seen it actually pick up changes and effect what I see in the debugging window.

So if you make a change to your source code, in the original repo you muyst use the green _Restart_ circle in the debugger to reload the extension in the sandbox window.

If you don't see code changes appearing, you may need to stop and start the debugger afresh.
