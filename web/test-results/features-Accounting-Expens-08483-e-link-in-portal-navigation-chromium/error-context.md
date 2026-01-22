# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - main [ref=e3]:
    - generic [ref=e4]:
      - heading "Log In" [level=2] [ref=e5]
      - generic [ref=e6]:
        - generic [ref=e7]:
          - generic [ref=e8]: Email or Phone
          - textbox "Email or Phone" [ref=e9]
        - generic [ref=e10]:
          - generic [ref=e11]: Password
          - textbox "Password" [ref=e12]
        - button "Log In" [ref=e13] [cursor=pointer]
      - generic [ref=e14]:
        - text: Don't have an account?
        - link "Sign Up" [ref=e15] [cursor=pointer]:
          - /url: /register
```