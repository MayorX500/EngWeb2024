import os
import re
import toml
import subprocess
import threading
import time

CONFIG_FILE = "config/config.toml"
DATASET = "dataset"
APP = "app"

class ThreadWithBrakes(threading.Thread):
    def __init__(self, stop_event):
        super().__init__()
        self.command = ["ls"]
        self.stop_event = stop_event
        self.process = None
        self.stdout = None
        self.stderr = None
        self.cwd = os.getcwd()

    def run(self):
        if self.stdout != subprocess.PIPE or self.stderr != subprocess.PIPE:
            if self.stdout != subprocess.PIPE:
                stdout_file = open(self.stdout, "w")
            if self.stdout != self.stderr:
                stderr_file = open(self.stderr, "w")
            else:
                stderr_file = stdout_file
        try:
            # Start a subprocess

            print(f"Starting subprocess: {self.command}")
            self.process = subprocess.Popen(self.command, cwd=self.cwd, stdout=stdout_file, stderr=stderr_file)
            
            # Wait for the subprocess to complete or for a stop event
            while self.process.poll() is None and not self.stop_event.is_set():
                pass
            
            if self.stop_event.is_set():
                # If stop event is set, terminate the subprocess
                print("Stopping subprocess")
                self.process.terminate()
                # Optionally wait a bit and kill if it's not terminating
                if self.process.poll() is None:
                    self.process.kill()
        except Exception as e:
            print(f"Error: {e}")
        finally:
            print("Thread and subprocess are stopped.")
            stdout_file.write("Thread and subprocess are stopped.")
            if self.stdout != subprocess.PIPE or self.stderr != subprocess.PIPE:
                if self.stdout != subprocess.PIPE:
                    stdout_file.close()
                if self.stdout != self.stderr:
                    stderr_file.close()
            


def main():
    # Create a threading event to signal stop
    stop_all = threading.Event()

    config = get_config()

    thread1 = ThreadWithBrakes(stop_all)
    thread2 = ThreadWithBrakes(stop_all)

    thread1.command = ["node", config["server"]["file"], str(config["server"]["port"])]
    thread2.command = ["json-server", config["api"]["file"]]

    # Set the working directory and output redirection for each thread
    # Note: You must adjust the ThreadWithBrakes class for this to work properly; see below
    thread1.cwd = config["server"]["dir"]
    thread1.stdout = config["server"]["log_file"]
    thread1.stderr = config["server"]["log_file"]

    thread2.cwd = config["api"]["dir"]
    thread2.stdout = config["api"]["log_file"]
    thread2.stderr = config["api"]["log_file"]

    thread2.start()
    thread1.start()

    #thread2.start()
    #thread1.start()
    try:
        while True:
            pass
    except KeyboardInterrupt:
        print("Exiting...")
        stop_all.set()
        thread1.join()
        thread2.join()
        print("Exited")



def get_config():
    config = toml.load(CONFIG_FILE)
    return config

if __name__ == "__main__":
    main()

    

