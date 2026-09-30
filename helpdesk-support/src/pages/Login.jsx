import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState(
    localStorage.getItem('rememberedEmail') || ''
  )

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [rememberMe, setRememberMe] = useState(
    Boolean(localStorage.getItem('rememberedEmail'))
  )

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  const validateEmail = value => {
    if (!value.trim()) {
      return 'Email is required'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address'
    }

    return ''
  }

  const validatePassword = value => {
    if (!value.trim()) {
      return 'Password is required'
    }

    if (value.length < 6) {
      return 'Password must be at least 6 characters'
    }

    return ''
  }

  const handleEmailChange = event => {
    const value = event.target.value

    setEmail(value)
    setLoginError('')

    if (emailTouched) {
      setEmailError(validateEmail(value))
    }
  }

  const handlePasswordChange = event => {
    const value = event.target.value

    setPassword(value)
    setLoginError('')

    if (passwordTouched) {
      setPasswordError(validatePassword(value))
    }
  }

  const handleEmailBlur = () => {
    setEmailTouched(true)
    setEmailError(validateEmail(email))
  }

  const handlePasswordBlur = () => {
    setPasswordTouched(true)
    setPasswordError(validatePassword(password))
  }

  const handleSubmit = event => {
    event.preventDefault()

    setEmailTouched(true)
    setPasswordTouched(true)

    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)

    setEmailError(emailValidation)
    setPasswordError(passwordValidation)
    setLoginError('')

    if (emailValidation || passwordValidation) {
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const registeredUser = JSON.parse(
        localStorage.getItem('supportmateUser')
      )

      const demoEmail = 'supportmate@example.com'
      const demoPassword = 'Support@123'

      const isRegisteredUserValid =
        registeredUser &&
        registeredUser.email === email &&
        registeredUser.password === password

      const isDemoUserValid =
        email === demoEmail &&
        password === demoPassword

      if (isRegisteredUserValid || isDemoUserValid) {
        const loggedInUser = isRegisteredUserValid
          ? {
              name: registeredUser.name,
              email: registeredUser.email,
              role: registeredUser.role || 'Support Agent'
            }
          : {
              name: 'Support Admin',
              email: demoEmail,
              role: 'Administrator'
            }

        localStorage.setItem(
          'supportmateCurrentUser',
          JSON.stringify(loggedInUser)
        )

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email)
        } else {
          localStorage.removeItem('rememberedEmail')
        }

        navigate('/dashboard')
      } else {
        setLoginError('Invalid email or password')
      }

      setIsLoading(false)
    }, 700)
  }

  return (
    <div className="login-page">

      <div className="login-container">

        <section className="login-brand-panel">

          <div className="brand-orb brand-orb-one"></div>
          <div className="brand-orb brand-orb-two"></div>
          <div className="brand-orb brand-orb-three"></div>

          <div className="brand-content">

            <div className="brand-topbar">

              <div className="brand-logo">

                <div className="brand-logo-icon">
                  <span>•••</span>
                </div>

                <span className="brand-logo-text">
                  Support<span>Mate</span>
                </span>

              </div>

              <div className="brand-navigation">
                <span>Support</span>
                <i></i>
                <span>Tickets</span>
                <i></i>
                <span>Teams</span>
                <i></i>
                <span>Analytics</span>
              </div>

            </div>

            <div className="brand-main">

              <span className="brand-label">
                HELPDESK PLATFORM
              </span>

              <h1 className="brand-title">
                Support<span>Mate</span>
              </h1>

              <p className="brand-tagline">
                Support smarter. Resolve faster.
              </p>

              <p className="brand-description">
                A centralized workspace for managing customer support
                tickets, teams, SLAs, and customer conversations.
              </p>

              <div className="brand-highlights">

                <div className="brand-highlight">

                  <div className="highlight-icon purple-icon">
                    ♧
                  </div>

                  <div>
                    <span className="highlight-number">
                      24/7
                    </span>

                    <span className="highlight-text">
                      Support Operations
                    </span>
                  </div>

                </div>

                <div className="brand-highlight">

                  <div className="highlight-icon green-icon">
                    ▮
                  </div>

                  <div>
                    <span className="highlight-number">
                      99%
                    </span>

                    <span className="highlight-text">
                      Ticket Visibility
                    </span>
                  </div>

                </div>

                <div className="brand-highlight">

                  <div className="highlight-icon blue-icon">
                    ●
                  </div>

                  <div>
                    <span className="highlight-number">
                      150+
                    </span>

                    <span className="highlight-text">
                      Support Agents
                    </span>
                  </div>

                </div>

                <div className="brand-highlight">

                  <div className="highlight-icon orange-icon">
                    ▰
                  </div>

                  <div>
                    <span className="highlight-number">
                      50K+
                    </span>

                    <span className="highlight-text">
                      Tickets Resolved
                    </span>
                  </div>

                </div>

              </div>

              <div className="dashboard-visual">

                <div className="dashboard-window">

                  <div className="dashboard-sidebar">

                    <div className="mini-logo">
                      <span></span>
                      SupportMate
                    </div>

                    <div className="mini-menu active">
                      <span>◈</span>
                      Overview
                    </div>

                    <div className="mini-menu">
                      <span>▣</span>
                      Tickets
                    </div>

                    <div className="mini-menu">
                      <span>◉</span>
                      Customers
                    </div>

                    <div className="mini-menu">
                      <span>◎</span>
                      Teams
                    </div>

                    <div className="mini-menu">
                      <span>◌</span>
                      Analytics
                    </div>

                  </div>

                  <div className="dashboard-main">

                    <div className="dashboard-header">

                      <div>
                        <span className="small-heading">
                          Support Dashboard
                        </span>

                        <strong>
                          Overview
                        </strong>
                      </div>

                      <div className="dashboard-avatar">
                        SA
                      </div>

                    </div>

                    <div className="dashboard-cards">

                      <div className="mini-card">
                        <span>Open Tickets</span>
                        <strong>128</strong>
                      </div>

                      <div className="mini-card">
                        <span>Resolved</span>
                        <strong>842</strong>
                      </div>

                      <div className="mini-card">
                        <span>SLA</span>
                        <strong>98%</strong>
                      </div>

                    </div>

                    <div className="ticket-list">

                      <div className="ticket-row">

                        <span className="ticket-dot"></span>

                        <div>
                          <strong>Payment issue</strong>
                          <small>#TK-1024</small>
                        </div>

                        <b>Open</b>

                      </div>

                      <div className="ticket-row">

                        <span className="ticket-dot blue-dot"></span>

                        <div>
                          <strong>Login problem</strong>
                          <small>#TK-1025</small>
                        </div>

                        <b>Pending</b>

                      </div>

                      <div className="ticket-row">

                        <span className="ticket-dot green-dot"></span>

                        <div>
                          <strong>Account update</strong>
                          <small>#TK-1026</small>
                        </div>

                        <b>Resolved</b>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="floating-card chart-card">

                  <span>
                    Ticket Trends
                  </span>

                  <div className="chart-bars">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>

                </div>

                <div className="floating-card message-card">

                  <span>
                    Messages
                  </span>

                  <strong>
                    24
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className="login-form-panel">

          <div className="login-content">

            <div className="login-header">

              <span className="login-welcome-label">
                WELCOME BACK
              </span>

              <h2 className="login-title">
                Sign in to <span>SupportMate</span>
              </h2>

              <p className="login-subtitle">
                Access your support workspace and manage your tickets.
              </p>

            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label
                  className="form-label"
                  htmlFor="email"
                >
                  Email Address
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    id="email"
                    type="email"
                    className={`form-input ${
                      emailError ? 'form-input-error' : ''
                    }`}
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />

                </div>

                {emailError && (
                  <p className="form-error">
                    {emailError}
                  </p>
                )}

              </div>

              <div className="form-group">

                <label
                  className="form-label"
                  htmlFor="password"
                >
                  Password
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    className={`form-input password-input ${
                      passwordError
                        ? 'form-input-error'
                        : ''
                    }`}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>

                </div>

                {passwordError && (
                  <p className="form-error">
                    {passwordError}
                  </p>
                )}

              </div>

              <div className="login-options">

                <label className="remember-me">

                  <input
                    type="checkbox"
                    className="remember-checkbox"
                    checked={rememberMe}
                    onChange={event =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                  />

                  <span className="custom-checkbox">
                    {rememberMe && '✓'}
                  </span>

                  <span>
                    Remember me
                  </span>

                </label>

                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() =>
                    navigate('/forgot-password')
                  }
                >
                  Forgot password?
                </button>

              </div>

              {loginError && (
                <div className="login-error-message">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="login-submit-button"
                disabled={isLoading}
              >

                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="button-arrow">
                      →
                    </span>
                  </>
                )}

              </button>

            </form>

            <div className="or-divider">

              <span></span>

              <b>OR</b>

              <span></span>

            </div>

            <div className="social-login">

              <button
                type="button"
                className="social-button"
              >
                <span className="google-icon">
                  G
                </span>

                Continue with Google
              </button>

              <button
                type="button"
                className="social-button"
              >
                <span className="microsoft-icon">
                  ▦
                </span>

                Continue with Microsoft
              </button>

            </div>

            <div className="login-demo-info">

              <div className="demo-left">

                <span className="demo-info-label">
                  Demo Login
                </span>

                <div className="demo-row">
                  <span>♙</span>
                  <span>
                    supportmate@example.com
                  </span>
                </div>

                <div className="demo-row">
                  <span>🔒</span>
                  <span>
                    Support@123
                  </span>
                </div>

              </div>

              <div className="demo-divider"></div>

              <div className="demo-help">

                <div className="info-circle">
                  i
                </div>

                <span>
                  Use demo credentials
                  <br />
                  to explore the application
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  )
}

export default Login