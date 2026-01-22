# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - link [ref=e4] [cursor=pointer]:
        - /url: /portal/profile
        - img [ref=e5]
      - heading "Edit Profile" [level=1] [ref=e7]
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: Full Name *
        - textbox "Full Name *" [active] [ref=e12]:
          - /placeholder: John Doe
          - text: Should Not Be Saved
        - paragraph [ref=e13]: Your display name in the system
      - generic [ref=e14]:
        - generic [ref=e15]: Phone Number (Optional)
        - textbox "Phone Number (Optional)" [ref=e16]:
          - /placeholder: +1 (555) 123-4567
        - paragraph [ref=e17]: We may use this for account recovery or notifications
      - generic [ref=e18]:
        - button "Save Changes" [ref=e19] [cursor=pointer]:
          - img [ref=e20]
          - text: Save Changes
        - link "Cancel" [ref=e24] [cursor=pointer]:
          - /url: /portal/profile
    - paragraph [ref=e26]:
      - strong [ref=e27]: "Note:"
      - text: Your email address cannot be changed. If you need to change your email, please contact support.
  - alert [ref=e28]
```