import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Button,
} from '../ui';
import { useToast } from '../../hooks/use-toast';

export const ShadcnComponentsDemo: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const materials = [
    { id: 1, name: 'Material 1', status: 'active', type: 'formula' },
    { id: 2, name: 'Material 2', status: 'pending', type: 'document' },
    { id: 3, name: 'Material 3', status: 'completed', type: 'image' },
  ];

  const handleProgress = () => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Upload completed",
            description: "File uploaded successfully",
            variant: "success",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">shadcn/ui Components Demo</h1>

      {/* Dialog Demo */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Dialog (Modal Windows)</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open modal window</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modal Window Example</DialogTitle>
              <DialogDescription>
                This is an example of using Dialog component to replace HITLInteractionModal
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>Modal window content...</p>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* Table Demo */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Table (Tables)</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>{material.id}</TableCell>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        material.status === 'active' ? 'default' :
                        material.status === 'pending' ? 'warning' : 'success'
                      }
                    >
                      {material.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{material.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Badge Demo */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Badge (Status Labels)</h2>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="default">Active</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Progress Demo */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Progress (Progress Bar)</h2>
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          <Button onClick={handleProgress} disabled={progress > 0 && progress < 100}>
            {progress === 0 ? 'Start upload' : progress === 100 ? 'Upload completed' : 'Uploading...'}
          </Button>
        </div>
      </section>

      {/* Tabs Demo */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tabs</h2>
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="nft">NFT</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="materials" className="mt-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">Materials Tab Content</h3>
              <p>Here will be the list of materials...</p>
            </div>
          </TabsContent>
          <TabsContent value="nft" className="mt-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">NFT Tab Content</h3>
              <p>Here will be NFT information...</p>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">Settings Tab Content</h3>
              <p>Here will be application settings...</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Navigation Menu Demo */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Navigation Menu</h2>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Materials</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                  <div className="row-span-3">
                    <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Material Management
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Creating, editing and viewing materials
                      </p>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                Profile
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </section>

      {/* Toast Demo */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Toast (Notifications)</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => toast({
              title: "Success!",
              description: "Operation completed successfully",
              variant: "success",
            })}
          >
            Show success
          </Button>
          <Button 
            onClick={() => toast({
              title: "Warning",
              description: "Check the entered data",
              variant: "warning",
            })}
          >
            Show warning
          </Button>
          <Button 
            onClick={() => toast({
              title: "Error",
              description: "Something went wrong",
              variant: "destructive",
            })}
          >
            Show error
          </Button>
        </div>
      </section>
    </div>
  );
};
