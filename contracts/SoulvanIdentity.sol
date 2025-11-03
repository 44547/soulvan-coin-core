contract SoulvanIdentity {
    struct Identity {
        address user;
        string photoHash;
        string preferences;
        string metadataURI;
    }

    mapping(address => Identity) public identities;

    function createIdentity(string memory photoHash, string memory preferences, string memory metadataURI) public {
        identities[msg.sender] = Identity(msg.sender, photoHash, preferences, metadataURI);
    }
}