# backend/locustfile.py
import os
from locust import HttpUser, task, between

class NotesAppUser(HttpUser):
    wait_time = between(1, 5)

    host = "http://localhost:8000"

    def on_start(self):
        """Called when a Locust user starts. Used for logging in."""
        self.token = None

        email = os.environ.get("TEST_USER_EMAIL", "test@example.com")
        password = os.environ.get("TEST_USER_PASSWORD", "testpassword")

        # The login endpoint expects form data
        response = self.client.post(
            "/api/auth/login", 
            data={"username": email, "password": password}
        )

        if response.status_code == 200:
            self.token = response.json().get("access_token")
        else:
            print(f"Failed to login user {email}. Status: {response.status_code}, Response: {response.text}")

    @task
    def get_notes(self):
        """Task to fetch all notes for the logged-in user."""
        if not self.token:
            # If login failed, don't attempt this task
            return

        headers = {"Authorization": f"Bearer {self.token}"}
        self.client.get("/api/notes/", headers=headers, name="/api/notes/ [auth]")