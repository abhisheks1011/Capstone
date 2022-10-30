const LoginForm = ({handleSubmit, email, setEmail, password, setPassword}) => (
    <form onSubmit={handleSubmit} className="mt-3">
    <div className="form-group mb-3">
        <lable className="form-label">Email address</lable>
        <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)}/>
    </div>

    <div className="form-group mb-3">
        <lable className="form-label">Password</lable>
        <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)}/>
    </div>

    <button disabled={!email || !password} className="btn btn-primary">Submit</button>
</form>
)

export default LoginForm;