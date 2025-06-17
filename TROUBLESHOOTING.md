# Troubleshooting

**Quick fixes for common issues**

## Mode Not Showing Up

**Problem:** I copied the mode file but it's not available in Roo

**Solution:**
1. Check the file is in the right location (see [`SIMPLE_SETUP.md`](SIMPLE_SETUP.md))
2. Restart VS Code completely
3. Make sure the file name ends with `.yaml` (not `.yaml.txt`)
4. Check the file isn't corrupted - it should start with `slug:` and `name:`

## Mode Not Working as Expected

**Problem:** The mode is available but doesn't seem enhanced

**Solution:**
1. Try explicitly asking: *"Use [mode name] to help me with..."*
2. Give the AI a moment to initialize the mode's capabilities
3. Check if you're using a hybrid mode - they have more advanced features

## ConPort Database Issues

**Problem:** Getting errors about ConPort or database operations

**Solution:**
1. The database creates itself automatically - no setup needed
2. If you see errors, try: *"Initialize a new ConPort database for this workspace"*
3. Make sure you have write permissions in your project directory

## File Permission Errors

**Problem:** Can't copy files or getting permission errors

**Solution:**
1. Make sure VS Code has write permissions to the configuration directory
2. Try running VS Code as administrator (Windows) or with sudo (Mac/Linux)
3. Check the configuration directory exists - create it if needed

## Modes Seem Slow or Unresponsive

**Problem:** AI responses are slower than usual

**Solution:**
1. Enhanced modes do more work, so they may take a bit longer
2. The first use of a mode in a session may be slower as it initializes
3. Subsequent uses should be faster as the knowledge base builds up

## Can't Find Configuration Directory

**Problem:** Don't know where to put the mode files

**The directories:**

**Windows:**
```
C:\Users\[YourUsername]\AppData\Roaming\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\
```

**Mac:**
```
/Users/[YourUsername]/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/
```

**Linux:**
```
/home/[YourUsername]/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/
```

**Quick way to find it:**
1. Open VS Code
2. Go to Settings (Ctrl/Cmd + ,)
3. Search for "roo"
4. Look for file paths in the settings

## Still Having Issues?

**Quick checks:**
- [ ] VS Code is up to date
- [ ] Roo extension is installed and enabled
- [ ] Mode files are valid YAML (no syntax errors)
- [ ] You're asking the AI to use the mode explicitly

**Need more help?**
- Check [`FAQ.md`](FAQ.md) for common questions
- Look at [`docs/guides/`](docs/guides/) for detailed documentation
- Try the examples in [`COMMON_WORKFLOWS.md`](COMMON_WORKFLOWS.md)

**Still stuck?** The issue might be with your specific setup. Try starting with just one simple mode (like `ask.yaml`) to verify the basic system works.