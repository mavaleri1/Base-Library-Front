// Pinata configuration
const PINATA_CONFIG = {
  apiKey: String(import.meta.env.VITE_PINATA_API_KEY || 'af7a2d18f1e76f9f6e2b'),
  secretKey: String(import.meta.env.VITE_PINATA_SECRET_KEY || '96d010d44e8e21691eefc0f5bccd55ebad539e7abe39e15e62ed4a3f64f94a3e'),
  gateway: 'https://gateway.pinata.cloud/ipfs/',
  apiUrl: 'https://api.pinata.cloud'
};

class IPFSService {
  private pinataConfig: typeof PINATA_CONFIG;

  constructor() {
    this.pinataConfig = PINATA_CONFIG;
    
    this.validatePinataConfig();
  }

  /**
   * Validate Pinata configuration
   */
  private validatePinataConfig(): void {
    const { apiKey, secretKey } = this.pinataConfig;
    
    if (!apiKey || !secretKey) {
      console.warn('Pinata API keys are not configured. Check environment variables VITE_PINATA_API_KEY and VITE_PINATA_SECRET_KEY');
      return;
    }
    
    if (apiKey === 'your_pinata_api_key_here' || secretKey === 'your_pinata_secret_key_here') {
      console.warn('Pinata API keys are not configured. Replace default values with your real keys from https://app.pinata.cloud/developers/api-keys');
      return;
    }
    
    if (apiKey.length < 20 || secretKey.length < 40) {
      console.warn('Pinata API keys appear incomplete. Check the correctness of keys in .env file');
      return;
    }

    // Check that keys contain only valid characters
    const validKeyPattern = /^[a-zA-Z0-9]+$/;
    if (!validKeyPattern.test(apiKey) || !validKeyPattern.test(secretKey)) {
      console.warn('Pinata API keys contain invalid characters. Keys should contain only letters and numbers');
      return;
    }
    
    console.log('Pinata API keys are configured correctly');
  }

  /**
   * Upload file to IPFS via Pinata
   * @param file File to upload
   * @returns File CID
   */
  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
          type: 'educational-material-file',
          uploadedAt: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0
      });
      formData.append('pinataOptions', options);

      const response = await fetch(`${this.pinataConfig.apiUrl}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataConfig.apiKey,
          'pinata_secret_api_key': this.pinataConfig.secretKey,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('Error uploading file to Pinata:', error);
      throw new Error('Failed to upload file to IPFS via Pinata');
    }
  }

  /**
   * Upload JSON data to IPFS via Pinata
   * @param data Data to upload
   * @returns Data CID
   */
  async uploadJSON(data: any): Promise<string> {
    try {
      const response = await fetch(`${this.pinataConfig.apiUrl}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'pinata_api_key': this.pinataConfig.apiKey,
          'pinata_secret_api_key': this.pinataConfig.secretKey,
        },
        body: JSON.stringify({
          pinataContent: data,
          pinataMetadata: {
            name: `material-${Date.now()}.json`,
            keyvalues: {
              type: 'educational-material-json',
              uploadedAt: new Date().toISOString()
            }
          },
          pinataOptions: {
            cidVersion: 0
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error);
      throw new Error('Failed to upload data to IPFS via Pinata');
    }
  }

  /**
   * Upload text to IPFS via Pinata
   * @param content Text content
   * @returns Content CID
   */
  async uploadText(content: string): Promise<string> {
    try {
      // Clean content from potentially problematic characters
      const cleanContent = content
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/\uFEFF/g, ''); // Remove BOM

      const response = await fetch(`${this.pinataConfig.apiUrl}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'pinata_api_key': this.pinataConfig.apiKey,
          'pinata_secret_api_key': this.pinataConfig.secretKey,
        },
        body: JSON.stringify({
          pinataContent: {
            content: cleanContent,
            type: 'text/plain',
            encoding: 'utf-8'
          },
          pinataMetadata: {
            name: `material-text-${Date.now()}.txt`,
            keyvalues: {
              type: 'educational-material-text',
              uploadedAt: new Date().toISOString()
            }
          },
          pinataOptions: {
            cidVersion: 0
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage += ` - ${errorData.error.reason || errorData.error.details || errorData.error}`;
          }
        } catch {
          errorMessage += ` - ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('Error uploading text to Pinata:', error);
      throw new Error('Failed to upload text to IPFS via Pinata');
    }
  }

  /**
   * Get content by CID via Pinata gateway
   * @param cid IPFS CID
   * @returns File content
   */
  async getContent(cid: string): Promise<string> {
    try {
      const response = await fetch(`${this.pinataConfig.gateway}${cid}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error getting content from Pinata:', error);
      throw new Error('Failed to get content from IPFS via Pinata');
    }
  }

  /**
   * Get JSON data by CID via Pinata
   * @param cid IPFS CID
   * @returns JSON data
   */
  async getJSON(cid: string): Promise<any> {
    try {
      const content = await this.getContent(cid);
      
      // If content contains nested JSON (as in uploadText)
      if (content.includes('"content"')) {
        const parsed = JSON.parse(content);
        if (parsed.content) {
          return JSON.parse(parsed.content);
        }
      }
      
      return JSON.parse(content);
    } catch (error) {
      console.error('Error getting JSON from Pinata:', error);
      throw new Error('Failed to get JSON from IPFS via Pinata');
    }
  }

  /**
   * Check content availability in IPFS
   * @param cid IPFS CID
   * @returns true if content is available
   */
  async isContentAvailable(cid: string): Promise<boolean> {
    try {
      await this.getContent(cid);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get URL for accessing content via Pinata gateway
   * @param cid IPFS CID
   * @returns Access URL
   */
  getContentURL(cid: string): string {
    return `${this.pinataConfig.gateway}${cid}`;
  }

  /**
   * Get list of pinned files from Pinata
   * @returns List of pinned files
   */
  async getPinnedFiles(): Promise<any[]> {
    try {
      const response = await fetch(`${this.pinataConfig.apiUrl}/data/pinList`, {
        method: 'GET',
        headers: {
          'pinata_api_key': this.pinataConfig.apiKey,
          'pinata_secret_api_key': this.pinataConfig.secretKey,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.rows || [];
    } catch (error) {
      console.error('Error getting file list from Pinata:', error);
      throw new Error('Failed to get file list from Pinata');
    }
  }

  /**
   * Remove file from Pinata
   * @param cid IPFS CID to remove
   */
  async unpinFile(cid: string): Promise<void> {
    try {
      const response = await fetch(`${this.pinataConfig.apiUrl}/pinning/unpin/${cid}`, {
        method: 'DELETE',
        headers: {
          'pinata_api_key': this.pinataConfig.apiKey,
          'pinata_secret_api_key': this.pinataConfig.secretKey,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error removing file from Pinata:', error);
      throw new Error('Failed to remove file from Pinata');
    }
  }

  /**
   * Upload material with metadata to IPFS
   * @param materialData Material data
   * @returns Material CID
   */
  async uploadMaterial(materialData: {
    content: string;
    title: string;
    subject: string;
    grade: string;
    topic: string;
    author: string;
    createdAt: string;
  }): Promise<string> {
    try {
      const materialWithMetadata = {
        ...materialData,
        version: '1.0',
        type: 'educational-material',
        timestamp: new Date().toISOString()
      };

      return await this.uploadJSON(materialWithMetadata);
    } catch (error) {
      console.error('Error uploading material to IPFS:', error);
      throw new Error('Failed to upload material to IPFS');
    }
  }
}

// Export singleton instance
export const ipfsService = new IPFSService();
export default ipfsService;
