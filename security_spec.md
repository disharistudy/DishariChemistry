# Security Specification — Dishari Chemistry

## 1. Data Invariants
- A student cannot read or write another student's profile, bookmarks, notes, or lesson progress.
- Users cannot assign themselves `admin` role or elevate privileges without administrative credentials.
- The administrator is bootstrapped to `disharistudy@gmail.com`.
- Public resources (courses, chapters, lessons, chemical reactions, periodic elements, formulas, quiz sets, and announcements) are readable by any authenticated or anonymous student, but mutable only by admins.
- User-generated content reports (`content_reports`) can be submitted by anyone, but only read, updated, or deleted by administrators.
- Quiz attempts (`quiz_attempts`) are immutable once completed and can only be written by the respective user.

## 2. The Dirty Dozen Attack Payloads

1. **Payload 1: User Profile Privilege Escalation**
   `{ "id": "attacker_1", "role": "admin", "full_name": "Attacker", "email": "attacker@fake.com" }`
   Expected Result: `PERMISSION_DENIED` (cannot grant admin to self).

2. **Payload 2: Profile Impersonation / ID Mismatch**
   `{ "id": "victim_uid", "full_name": "Victim", "email": "victim@school.edu" }` written by `attacker_uid`.
   Expected Result: `PERMISSION_DENIED` (UID mismatch).

3. **Payload 3: Arbitrary Field Injection (Shadow Update)**
   `{ "note_text": "Updated note", "ghost_flag": true, "backdoor": 123 }` into `/users/{uid}/notes/{noteId}`.
   Expected Result: `PERMISSION_DENIED` (strict key schema violated via `hasOnly`).

4. **Payload 4: Read Another Student's Notes**
   `get(/users/victim_uid/notes/note_1)` authenticated as `attacker_uid`.
   Expected Result: `PERMISSION_DENIED` (isOwner check fails).

5. **Payload 5: Read Another Student's Bookmarks**
   `get(/users/victim_uid/bookmarks/bm_1)` authenticated as `attacker_uid`.
   Expected Result: `PERMISSION_DENIED` (isOwner check fails).

6. **Payload 6: Tampering with Another User's Quiz Attempt**
   `set(/quiz_attempts/attempt_1, { "user_id": "victim_uid", "score": 0 })` by `attacker_uid`.
   Expected Result: `PERMISSION_DENIED` (user_id must equal request.auth.uid).

7. **Payload 7: Modifying Immutable Course Curriculum**
   `set(/courses/chem_hsc_1, { "title_bn": "Hacked Course" })` by a standard student user.
   Expected Result: `PERMISSION_DENIED` (admin-only mutation).

8. **Payload 8: Deleting Admin Audit Logs**
   `delete(/audit_logs/log_1)` by any user.
   Expected Result: `PERMISSION_DENIED` (audit logs cannot be deleted).

9. **Payload 9: Huge String Injection (Denial of Wallet / Resource Poisoning)**
   `{ "note_text": "A".repeat(100000) }` into notes.
   Expected Result: `PERMISSION_DENIED` (length limit exceeded, max length 5,000 chars).

10. **Payload 10: Unverified Email Admin Spoofing**
    User with unverified token trying to access `/admins/{uid}` or modifying courses.
    Expected Result: `PERMISSION_DENIED`.

11. **Payload 11: Illegitimate Document ID Path Variable (ID Poisoning)**
    Writing to `/users/{uid}/notes/` with doc ID containing illegal special chars or exceeding 128 bytes.
    Expected Result: `PERMISSION_DENIED` (isValidId regex fails).

12. **Payload 12: Public Query Scraping of Content Reports**
    Standard student performing `list` on `/content_reports`.
    Expected Result: `PERMISSION_DENIED` (only admins can list content reports).
