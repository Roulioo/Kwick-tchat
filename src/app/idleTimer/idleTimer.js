class IdleTimer {
    constructor({ timeout, onTimeout, inactivityTime }) {
      this.timeout = timeout;
      this.onTimeout = onTimeout;
      this.inactivityTime = inactivityTime;

      this.eventHandler = this.updateExpiredTime.bind(this);
      this.tracker();
      this.startInterval();
    }

    /**
     * Start interval
     */
    startInterval() {
      // update expired time
      this.updateExpiredTime();

      // interval trigger in each 1 second
      this.interval = setInterval(() => {

        // time of inactivity
        this.inactivityTime += 1;
        localStorage.setItem('inactivityTime', JSON.stringify(this.inactivityTime));

        // expired time in local storage
        const expiredTime = parseInt(localStorage.getItem("_expiredTime"), 10);

        // if expiredTime < recent time
        if (expiredTime < Date.now()) {
          if (this.onTimeout) {
            this.onTimeout();
            this.cleanUp();
          }
        }
      }, 1000);
    }

    /**
     * Update expired time on localStorage
     */
    updateExpiredTime() {
      // clear timeoutTracker if user interacte with webpage
      if (this.timeoutTracker) {
        clearTimeout(this.timeoutTracker);
      }

      this.timeoutTracker = setTimeout(() => {
        // reset time of inactivity to 0
        this.inactivityTime = 0;

        // update expiredTime in localStorage
        localStorage.setItem("_expiredTime", Date.now() + this.timeout * 1000);
      }, 300);
    }

    /**
     * Create event listener to detect user activity
     */
    tracker() {
      window.addEventListener("mousemove", this.eventHandler);
      window.addEventListener("scroll", this.eventHandler);
      window.addEventListener("keydown", this.eventHandler);
    }

    /**
     * Clean interval + events listener
     */
    cleanUp() {
      clearInterval(this.interval);
      window.removeEventListener("mousemove", this.eventHandler);
      window.removeEventListener("scroll", this.eventHandler);
      window.removeEventListener("keydown", this.eventHandler);
    }
}

export default IdleTimer;
