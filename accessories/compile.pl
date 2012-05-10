#!/usr/bin/perl
use strict;
use warnings;

use Path::Class;
use Javascript::Closure qw(minify :CONSTANTS); 

my $input = dir("../modules");
my $output = dir("../")->file("vn-c.js");

my @inputList = ("vn.js", "ui.js", "source.js", "main.js", "history.js", "config.js");

my $header = "(function() {";
my $footer = "vn.init();})();";

my $output_handle = $output->openw();

$output_handle->print($header . "\n");

foreach my $file (@inputList) {
	my $file_handle = $input->file($file)->openr();
	while (my $line = $file_handle->getline()) {
		$output_handle->print($line);
	}
}

$output_handle->print($footer);
$output_handle->close();

open (FILE,'<../vn-c.js') or die $!;
my @lines = <FILE>;
close FILE;
my $compressed = minify(input=>join('',@lines),compilation_level=>SIMPLE_OPTIMIZATIONS);
open FILE,'>../vn-m.js' or die $!;
print FILE $compressed;
close FILE;