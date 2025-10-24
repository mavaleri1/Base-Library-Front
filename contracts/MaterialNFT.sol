// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MaterialNFT
 * @dev NFT contract 
 * Links author with material through NFT with metadata in blockchain
 */
contract MaterialNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Material metadata structure
    struct MaterialMetadata {
        string subject;      // "Mathematics", "Physics", "Web3", etc.
        string grade;       // "7th Grade USA", "University", "Professional"
        string topic;       // "Linear Equations", "Blockchain Fundamentals"
        string contentHash; // SHA-256 content hash for verification
        string ipfsCid;     // IPFS CID for material access
        address author;      // Material author
        uint256 createdAt;   // Creation time (timestamp)
        uint256 updatedAt;   // Last update time
        bool isPublished;    // Publication status
        string title;        // Material title
        uint256 wordCount;   // Word count
    }
    
    // Token ID -> metadata mapping
    mapping(uint256 => MaterialMetadata) public materials;
    
    // Author -> material count mapping
    mapping(address => uint256) public authorMaterialCount;
    
    // Subject -> material count mapping
    mapping(string => uint256) public subjectCount;
    
    // Content hash -> token ID mapping (to prevent duplicates)
    mapping(string => uint256) public contentHashToTokenId;
    
    // Events
    event MaterialCreated(
        uint256 indexed tokenId,
        address indexed author,
        string subject,
        string topic,
        string ipfsCid
    );
    
    event MaterialUpdated(
        uint256 indexed tokenId,
        string newIpfsCid,
        string newContentHash
    );
    
    event MaterialPublished(
        uint256 indexed tokenId,
        bool isPublished
    );
    
constructor() ERC721("BaseLibrary", "BaseED") Ownable(msg.sender) {}
    
    /**
     * @dev Create new material NFT
     * @param to NFT recipient address (usually author)
     * @param subject Material subject
     * @param grade Difficulty level
     * @param topic Specific topic
     * @param contentHash SHA-256 content hash
     * @param ipfsCid Material IPFS CID
     * @param title Material title
     * @param wordCount Word count
     */
    function createMaterial(
        address to,
        string memory subject,
        string memory grade,
        string memory topic,
        string memory contentHash,
        string memory ipfsCid,
        string memory title,
        uint256 wordCount
    ) external onlyOwner returns (uint256) {
        // Check if NFT with same contentHash already exists
        require(contentHashToTokenId[contentHash] == 0, "Material with this content already exists");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(to, newTokenId);
        
        MaterialMetadata memory metadata = MaterialMetadata({
            subject: subject,
            grade: grade,
            topic: topic,
            contentHash: contentHash,
            ipfsCid: ipfsCid,
            author: to,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            isPublished: false,
            title: title,
            wordCount: wordCount
        });
        
        materials[newTokenId] = metadata;
        authorMaterialCount[to]++;
        subjectCount[subject]++;
        contentHashToTokenId[contentHash] = newTokenId;
        
        emit MaterialCreated(newTokenId, to, subject, topic, ipfsCid);
        
        return newTokenId;
    }
    
    /**
     * @dev Update material (author only)
     * @param tokenId Token ID
     * @param newIpfsCid New IPFS CID
     * @param newContentHash New content hash
     */
    function updateMaterial(
        uint256 tokenId,
        string memory newIpfsCid,
        string memory newContentHash
    ) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(materials[tokenId].author == msg.sender, "Not the author");
        
        materials[tokenId].ipfsCid = newIpfsCid;
        materials[tokenId].contentHash = newContentHash;
        materials[tokenId].updatedAt = block.timestamp;
        
        emit MaterialUpdated(tokenId, newIpfsCid, newContentHash);
    }
    
    /**
     * @dev Publish/unpublish material
     * @param tokenId Token ID
     * @param published Publication status
     */
    function setPublished(uint256 tokenId, bool published) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(materials[tokenId].author == msg.sender, "Not the author");
        
        materials[tokenId].isPublished = published;
        
        emit MaterialPublished(tokenId, published);
    }
    
    /**
     * @dev Get material metadata
     * @param tokenId Token ID
     */
    function getMaterialMetadata(uint256 tokenId) 
        external 
        view 
        returns (MaterialMetadata memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return materials[tokenId];
    }
    
    /**
     * @dev Check material authorship
     * @param tokenId Token ID
     * @param author Address to check
     */
    function isAuthor(uint256 tokenId, address author) 
        external 
        view 
        returns (bool) 
    {
        return materials[tokenId].author == author;
    }
    
    /**
     * @dev Get all author materials
     * @param author Author address
     */
    function getAuthorMaterials(address author) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256[] memory tokenIds = new uint256[](authorMaterialCount[author]);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (materials[i].author == author) {
                tokenIds[index] = i;
                index++;
            }
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Get published materials by subject
     * @param subject Subject for filtering
     */
    function getPublishedMaterialsBySubject(string memory subject) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256[] memory tempTokenIds = new uint256[](_tokenIds.current());
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (materials[i].isPublished && 
                keccak256(bytes(materials[i].subject)) == keccak256(bytes(subject))) {
                tempTokenIds[count] = i;
                count++;
            }
        }
        
        uint256[] memory tokenIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokenIds[i] = tempTokenIds[i];
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Get subject statistics
     */
    function getSubjectStats() 
        external 
        view 
        returns (string[] memory subjects, uint256[] memory counts) 
    {
        uint256 totalTokens = _tokenIds.current();
        if (totalTokens == 0) {
            return (new string[](0), new uint256[](0));
        }
        
        // Create a mapping to count subjects
        string[] memory allSubjects = new string[](totalTokens);
        uint256[] memory subjectCounts = new uint256[](totalTokens);
        uint256 uniqueSubjectCount = 0;
        
        // Collect all unique subjects and their counts
        for (uint256 i = 1; i <= totalTokens; i++) {
            string memory subject = materials[i].subject;
            bool found = false;
            
            // Check if subject already exists
            for (uint256 j = 0; j < uniqueSubjectCount; j++) {
                if (keccak256(bytes(allSubjects[j])) == keccak256(bytes(subject))) {
                    subjectCounts[j]++;
                    found = true;
                    break;
                }
            }
            
            // If subject not found, add it
            if (!found) {
                allSubjects[uniqueSubjectCount] = subject;
                subjectCounts[uniqueSubjectCount] = 1;
                uniqueSubjectCount++;
            }
        }
        
        // Return top 10 subjects (or all if less than 10)
        uint256 resultCount = uniqueSubjectCount > 10 ? 10 : uniqueSubjectCount;
        subjects = new string[](resultCount);
        counts = new uint256[](resultCount);
        
        // Simple bubble sort to get top subjects (for small datasets)
        for (uint256 i = 0; i < resultCount; i++) {
            uint256 maxIndex = i;
            for (uint256 j = i + 1; j < uniqueSubjectCount; j++) {
                if (subjectCounts[j] > subjectCounts[maxIndex]) {
                    maxIndex = j;
                }
            }
            
            // Swap
            if (maxIndex != i) {
                string memory tempSubject = allSubjects[i];
                uint256 tempCount = subjectCounts[i];
                allSubjects[i] = allSubjects[maxIndex];
                subjectCounts[i] = subjectCounts[maxIndex];
                allSubjects[maxIndex] = tempSubject;
                subjectCounts[maxIndex] = tempCount;
            }
            
            subjects[i] = allSubjects[i];
            counts[i] = subjectCounts[i];
        }
        
        return (subjects, counts);
    }
    
    /**
     * @dev Check if content hash already exists
     * @param contentHash Content hash to check
     */
    function contentHashExists(string memory contentHash) 
        external 
        view 
        returns (bool) 
    {
        return contentHashToTokenId[contentHash] != 0;
    }
    
    /**
     * @dev Get token ID by content hash
     * @param contentHash Content hash
     */
    function getTokenIdByContentHash(string memory contentHash) 
        external 
        view 
        returns (uint256) 
    {
        return contentHashToTokenId[contentHash];
    }
    
    /**
     * @dev Check token existence
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId <= _tokenIds.current();
    }
    
    /**
     * @dev Override to add base URI
     */
    function _baseURI() internal pure override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/";
    }
}
