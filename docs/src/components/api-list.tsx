import { useState } from 'react';
import { Search, Box, Layers, ArrowRight } from 'lucide-react';

import apiDefinition from '@/api-definition.json';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Type definitions based on the JSON structure
interface Parameter {
  name: string;
  type: string;
  optional: boolean;
  description: string;
}

interface Method {
  name: string;
  version: number;
  httpmethod: string;
  parameters: Parameter[];
}

interface Interface {
  name: string;
  methods: Method[];
}

interface ApiDefinition {
  apilist: {
    interfaces: Interface[];
  };
}

const data = apiDefinition as ApiDefinition;

export function ApiList() {
  const [selectedInterfaceName, setSelectedInterfaceName] = useState<string | null>(
    data.apilist.interfaces[0]?.name || null,
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInterfaces = data.apilist.interfaces.filter(iface =>
    iface.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedInterface = data.apilist.interfaces.find(
    iface => iface.name === selectedInterfaceName,
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-72 border-r bg-card/50 flex flex-col backdrop-blur-xl">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Box className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="text-sm font-bold tracking-wide uppercase text-muted-foreground">
              Steam API
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter interfaces..."
              className="pl-8 h-8 text-xs bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/50"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {filteredInterfaces.map(iface => (
              <Button
                key={iface.name}
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full justify-start text-left font-normal text-xs h-8 px-3 rounded-md transition-all',
                  selectedInterfaceName === iface.name
                    ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => setSelectedInterfaceName(iface.name)}
              >
                <Layers className="mr-2 h-3.5 w-3.5 opacity-70" />
                <span className="truncate">{iface.name}</span>
                {selectedInterfaceName === iface.name && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
                )}
              </Button>
            ))}
            {filteredInterfaces.length === 0 && (
              <div className="p-4 text-xs text-muted-foreground text-center">
                No interfaces found.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background/50">
        {selectedInterface ? (
          <>
            <div className="px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
              <div className="flex items-baseline justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    {selectedInterface.name}
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {selectedInterface.methods.length} methods
                  </p>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6 max-w-5xl mx-auto space-y-4 pb-20">
                {selectedInterface.methods.map(method => (
                  <Card
                    key={method.name}
                    className="overflow-hidden border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
                  >
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            'font-mono text-[10px] px-1.5 py-0.5 h-5 border-0',
                            method.httpmethod === 'GET'
                              ? 'bg-blue-500/10 text-blue-500'
                              : method.httpmethod === 'POST'
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-orange-500/10 text-orange-500',
                          )}
                        >
                          {method.httpmethod}
                        </Badge>
                        <CardTitle className="font-mono text-sm font-medium text-foreground">
                          {method.name}
                        </CardTitle>
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 rounded">
                          v{method.version}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      {method.parameters.length > 0 ? (
                        <div className="mt-2 rounded-md border border-border/40 bg-muted/20 overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-muted/40 text-muted-foreground font-medium">
                              <tr>
                                <th className="px-3 py-2 w-[200px]">Parameter</th>
                                <th className="px-3 py-2 w-[100px]">Type</th>
                                <th className="px-3 py-2">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                              {method.parameters.map(param => (
                                <tr
                                  key={param.name}
                                  className="group hover:bg-muted/30 transition-colors"
                                >
                                  <td className="px-3 py-2 font-mono text-foreground/90">
                                    <div className="flex items-center gap-2">
                                      {param.name}
                                      {param.optional && (
                                        <span className="text-[9px] text-muted-foreground border border-border px-1 rounded">
                                          opt
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 font-mono text-muted-foreground">
                                    {param.type}
                                  </td>
                                  <td className="px-3 py-2 text-muted-foreground/80">
                                    {param.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground italic pl-1">
                          No parameters required.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="p-4 rounded-full bg-muted/50">
              <ArrowRight className="h-6 w-6 opacity-50" />
            </div>
            <p className="text-sm">Select an interface to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
