import { spawn } from "node:child_process";

export function runCmd(command, args = [], opts = {}) {
  const { cwd, env, onLine = () => {}, onErrorLine = () => {} } = opts;

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, ...(env ?? {}) },
      shell: process.platform === "win32", // helps on windows cuz windows sometimes need shell to run npm
    });

    const pipeLines = (stream, cb) => {
      let buf = "";
      stream.setEncoding("utf8");
      stream.on("data", (chunk) => {
        buf += chunk;
        const lines = buf.split(/\r?\n/);
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (line.trim().length) cb(line);
        }
      });
      stream.on("end", () => {
        if (buf.trim().length) cb(buf);
      });
    };

    pipeLines(child.stdout, onLine);
    pipeLines(child.stderr, onErrorLine);

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}
