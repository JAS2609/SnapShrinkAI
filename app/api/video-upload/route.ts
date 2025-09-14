import { NextRequest,NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary} from "cloudinary";
import { PrismaClient } from "@prisma/client";



    const prisma=new PrismaClient();




    cloudinary.config({ 
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    interface CloudinaryUploadResult{
        public_id:string;
        bytes:number;
        duration?:number;
       [key:string]:any
    }
export async function POST(request:NextRequest){
   
    try {
         const { userId } = await auth();
    if(!userId){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }
    if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME||!process.env.CLOUDINARY_API_KEY||!process.env.CLOUDINARY_API_SECRET){
        return NextResponse.json({message:"Cloudinary is not configured"},{status:500})}


        const formData=await request.formData();
        const file=formData.get("file") as File||null;
        const title=formData.get("title") as string||"Untitled";
        const description=formData.get("description") as string||"No description";
        const originalSize=formData.get("originalSize") as string||"0";
        if(!file){
            return NextResponse.json({message:"File is required"},{status:400})
        }
        const bytes=await file.arrayBuffer();
        const buffer=Buffer.from(bytes);
      const result= await new Promise<CloudinaryUploadResult>(
            (resolve,reject)=>{
               const uploadStream= cloudinary.uploader.upload_stream({
                resource_type:"video",    
                folder:"video-uploads",
                transformation:[{
                    quality:"auto",
                    fetch_format:"mp4"
                }]   
                },(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result as CloudinaryUploadResult)
                    }
                })
                uploadStream.end(buffer)
            }
        )
        const video= await prisma.video.create({
            data:{
                title,
                description,
                originalSize:originalSize,
                compressedSize:String(result.bytes),
                duration:result.duration||0,
                publicId:result.public_id,
            }
           
        })
         return NextResponse.json(video)
    } catch (error) {
        console.log("upload video failed",error);

        return NextResponse.json({message:"Internal server error"},{status:500})
    }finally{
        await prisma.$disconnect()
    }
}