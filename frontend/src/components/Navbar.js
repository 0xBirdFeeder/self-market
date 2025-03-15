import WalletLogin from "./WalletLogin"

const Navbar = () => {
  const navbarStyle = {
    position: "absolute",
    width: "100vw",
    top: 0,
    display: "grid",
    height: "15vh",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr"
  }

  const rightSegmentStyle = {
    width: "calc(100% - 40px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    marginRight: "40px"
  }

  return (
    <div style={navbarStyle}>
      <div></div>
      <div></div>
      <div style={rightSegmentStyle}>
        <WalletLogin />
      </div>
    </div>
  )
}

export default Navbar