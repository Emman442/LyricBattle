import { useState } from "react";
import { AlertCircle, ExternalLink, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useWallet } from "@/components/genlayer/wallet";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const METAMASK_INSTALL_URL = "https://metamask.io/download/";

const WalletConnect = () => {
  const {
    address,
    isConnected,
    isMetaMaskInstalled,
    isLoading,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setConnectionError("");
      await connectWallet();
      setIsModalOpen(false);
    } catch (err: any) {
      setConnectionError(err.message || "Failed to connect to MetaMask");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        {isConnected ? (
          <Button variant="outline" size="sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
        ) : (
          <Button disabled={isLoading}>
            <User className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Connect to GenLayer
          </DialogTitle>
          <DialogDescription>
            Connect your MetaMask wallet to play LyricBattle
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!isMetaMaskInstalled ? (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>MetaMask Not Detected</AlertTitle>
                <AlertDescription>
                  Please install MetaMask to connect your wallet.
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => window.open(METAMASK_INSTALL_URL, "_blank")}
                className="w-full h-12"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Install MetaMask
              </Button>
            </>
          ) : isConnected ? (
            <>
              <div className="p-4 rounded-lg bg-muted/10 border border-muted/20">
                <p className="text-sm text-muted-foreground">Connected as</p>
                <code className="text-sm font-mono">{address}</code>
              </div>
              <Button
                onClick={() => { disconnectWallet(); setIsModalOpen(false); }}
                variant="outline"
                className="w-full"
              >
                Disconnect
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleConnect}
                className="w-full h-12"
                disabled={isConnecting}
              >
                <User className="w-5 h-5 mr-2" />
                {isConnecting ? "Connecting..." : "Connect MetaMask"}
              </Button>
              {connectionError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>{connectionError}</AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnect;